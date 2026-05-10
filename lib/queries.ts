import db from "./db";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Category = "Groceries"|"Dining"|"Transport"|"Subscriptions"|"Income"|"Health"|"Shopping"|"Bills"|"Entertainment"|"Other";
export interface Transaction { id: string; user_id: string; date: string; merchant: string; description: string; category: Category; amount: number; }
export interface Bill        { id: string; user_id: string; name: string; description: string; logo: string; amount: number; due: string; status: "scheduled"|"due"|"paid"|"over"; recurring: "monthly"|"yearly"; }
export interface WishlistItem{ id: string; user_id: string; name: string; price: number; priority: "high"|"med"|"low"; note: string; }
export interface Goal        { id: string; user_id: string; name: string; target: number; saved: number; monthly: number; }
export interface JournalEntry{ id: string; user_id: string; date: string; mood: 1|2|3|4|5; title: string; body: string; tags: string[]; }
export interface Win         { id: string; user_id: string; date: string; type: string; title: string; body: string; tags: string[]; pinned: boolean; }
export interface SportsEntry { id: string; user_id: string; date: string; type: string; name: string; metric: string; }
export interface MediaItem   { id: string; user_id: string; type: string; title: string; author: string; status: "reading"|"watching"|"done"; rating: number|null; }

export interface SidebarCounts {
  transactions: number; bills: number; wishlist: number; goals: number;
  journal: number; wins: number; sports: number; media: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseTags(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

function count(table: string, userId: string): number {
  const row = db.prepare(`SELECT COUNT(*) as n FROM ${table} WHERE user_id = ?`).get(userId) as { n: number };
  return row.n;
}

// ── Sidebar counts ─────────────────────────────────────────────────────────────

export function getSidebarCounts(userId: string): SidebarCounts {
  return {
    transactions: count("transactions", userId),
    bills:        count("bills", userId),
    wishlist:     count("wishlist", userId),
    goals:        count("goals", userId),
    journal:      count("journal_entries", userId),
    wins:         count("wins", userId),
    sports:       count("sports_log", userId),
    media:        count("media_items", userId),
  };
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function getTransactions(userId: string): Transaction[] {
  return db.prepare(`SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC`).all(userId) as Transaction[];
}

// ── Bills ─────────────────────────────────────────────────────────────────────

export function getBills(userId: string): Bill[] {
  return db.prepare(`SELECT * FROM bills WHERE user_id = ? ORDER BY due ASC`).all(userId) as Bill[];
}

export function updateBillStatus(id: string, userId: string, status: Bill["status"]): void {
  db.prepare(`UPDATE bills SET status = ? WHERE id = ? AND user_id = ?`).run(status, id, userId);
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export function getWishlist(userId: string): WishlistItem[] {
  return db.prepare(`SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC`).all(userId) as WishlistItem[];
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export function getGoals(userId: string): Goal[] {
  return db.prepare(`SELECT * FROM goals WHERE user_id = ? ORDER BY created_at ASC`).all(userId) as Goal[];
}

// ── Journal ───────────────────────────────────────────────────────────────────

export function getJournalEntries(userId: string): JournalEntry[] {
  const rows = db.prepare(`SELECT * FROM journal_entries WHERE user_id = ? ORDER BY date DESC, created_at DESC`).all(userId) as (Omit<JournalEntry, "tags"> & { tags: string })[];
  return rows.map(r => ({ ...r, tags: parseTags(r.tags) }));
}

export function upsertJournalEntry(entry: Omit<JournalEntry, "user_id"> & { user_id: string }): void {
  db.prepare(`
    INSERT INTO journal_entries (id, user_id, date, mood, title, body, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET mood=excluded.mood, title=excluded.title, body=excluded.body, tags=excluded.tags
  `).run(entry.id, entry.user_id, entry.date, entry.mood, entry.title, entry.body, JSON.stringify(entry.tags));
}

// ── Wins ──────────────────────────────────────────────────────────────────────

export function getWins(userId: string): Win[] {
  const rows = db.prepare(`SELECT * FROM wins WHERE user_id = ? ORDER BY date DESC, created_at DESC`).all(userId) as (Omit<Win, "tags"|"pinned"> & { tags: string; pinned: number })[];
  return rows.map(r => ({ ...r, tags: parseTags(r.tags), pinned: r.pinned === 1 }));
}

// ── Sports ────────────────────────────────────────────────────────────────────

export function getSportsLog(userId: string): SportsEntry[] {
  return db.prepare(`SELECT * FROM sports_log WHERE user_id = ? ORDER BY date DESC, created_at DESC`).all(userId) as SportsEntry[];
}

// ── Media ─────────────────────────────────────────────────────────────────────

export function getMedia(userId: string): MediaItem[] {
  return db.prepare(`SELECT * FROM media_items WHERE user_id = ? ORDER BY created_at DESC`).all(userId) as MediaItem[];
}

// ── Dashboard summary ─────────────────────────────────────────────────────────

export function getDashboardSummary(userId: string) {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const income  = (db.prepare(`SELECT COALESCE(SUM(amount),0) as v FROM transactions WHERE user_id=? AND date>=? AND amount>0`).get(userId, monthStart) as { v: number }).v;
  const expense = (db.prepare(`SELECT COALESCE(SUM(amount),0) as v FROM transactions WHERE user_id=? AND date>=? AND amount<0`).get(userId, monthStart) as { v: number }).v;

  const upcomingBills = db.prepare(
    `SELECT * FROM bills WHERE user_id=? AND status != 'paid' ORDER BY due ASC LIMIT 4`
  ).all(userId) as Bill[];

  const goals = getGoals(userId);
  const lastJournal = getJournalEntries(userId)[0] ?? null;
  const pinnedWin   = getWins(userId).find(w => w.pinned) ?? null;
  const recentSports = getSportsLog(userId).slice(0, 3);

  return { income, expense, upcomingBills, goals, lastJournal, pinnedWin, recentSports };
}
