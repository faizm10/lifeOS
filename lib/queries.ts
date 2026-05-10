import db from "./db";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Category = "Groceries"|"Dining"|"Transport"|"Subscriptions"|"Income"|"Health"|"Shopping"|"Bills"|"Entertainment"|"Other";
export interface Transaction { id: string; user_id: string; date: string; merchant: string; description: string; category: Category; amount: number; account_id?: string; }
export interface Bill        { id: string; user_id: string; name: string; description: string; logo: string; amount: number; due: string; status: "scheduled"|"due"|"paid"|"over"; recurring: "monthly"|"yearly"; }
export interface WishlistItem{ id: string; user_id: string; name: string; price: number; priority: "high"|"med"|"low"; note: string; }
export interface Goal        { id: string; user_id: string; name: string; target: number; saved: number; monthly: number; }
export interface JournalEntry{ id: string; user_id: string; date: string; mood: 1|2|3|4|5; title: string; body: string; tags: string[]; }
export interface Win         { id: string; user_id: string; date: string; type: string; title: string; body: string; tags: string[]; pinned: boolean; }
export interface SportsEntry { id: string; user_id: string; date: string; type: string; name: string; metric: string; }
export interface MediaItem   { id: string; user_id: string; type: string; title: string; author: string; status: "reading"|"watching"|"done"; rating: number|null; }
export interface Account     { id: string; user_id: string; name: string; type: "Checking"|"Savings"|"Investment"|"Cash"|"Credit"; balance: number; note: string; }

export interface SidebarCounts {
  transactions: number; bills: number; wishlist: number; goals: number;
  journal: number; wins: number; sports: number; media: number; accounts: number;
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
    accounts:     count("accounts", userId),
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

export function insertBill(bill: Omit<Bill, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO bills (id, user_id, name, description, logo, amount, due, status, recurring) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(bill.id, bill.user_id, bill.name, bill.description, bill.logo, bill.amount, bill.due, bill.status, bill.recurring);
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export function getWishlist(userId: string): WishlistItem[] {
  return db.prepare(`SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC`).all(userId) as WishlistItem[];
}

export function insertWishlistItem(item: Omit<WishlistItem, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO wishlist (id, user_id, name, price, priority, note) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(item.id, item.user_id, item.name, item.price, item.priority, item.note);
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export function getGoals(userId: string): Goal[] {
  return db.prepare(`SELECT * FROM goals WHERE user_id = ? ORDER BY created_at ASC`).all(userId) as Goal[];
}

export function insertGoal(goal: Omit<Goal, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO goals (id, user_id, name, target, saved, monthly) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(goal.id, goal.user_id, goal.name, goal.target, goal.saved, goal.monthly);
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

export function insertWin(win: Omit<Win, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO wins (id, user_id, date, type, title, body, tags, pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(win.id, win.user_id, win.date, win.type, win.title, win.body, JSON.stringify(win.tags), win.pinned ? 1 : 0);
}

// ── Sports ────────────────────────────────────────────────────────────────────

export function getSportsLog(userId: string): SportsEntry[] {
  return db.prepare(`SELECT * FROM sports_log WHERE user_id = ? ORDER BY date DESC, created_at DESC`).all(userId) as SportsEntry[];
}

export function insertSportsEntry(entry: Omit<SportsEntry, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO sports_log (id, user_id, date, type, name, metric) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(entry.id, entry.user_id, entry.date, entry.type, entry.name, entry.metric);
}

// ── Media ─────────────────────────────────────────────────────────────────────

export function getMedia(userId: string): MediaItem[] {
  return db.prepare(`SELECT * FROM media_items WHERE user_id = ? ORDER BY created_at DESC`).all(userId) as MediaItem[];
}

export function insertMediaItem(item: Omit<MediaItem, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO media_items (id, user_id, type, title, author, status, rating) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(item.id, item.user_id, item.type, item.title, item.author, item.status, item.rating ?? null);
}

// ── Transactions ─ insert ─────────────────────────────────────────────────────

export function insertTransaction(tx: Omit<Transaction, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO transactions (id, user_id, date, merchant, description, category, amount, account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(tx.id, tx.user_id, tx.date, tx.merchant, tx.description, tx.category, tx.amount, tx.account_id ?? null);
  if (tx.account_id) {
    db.prepare(`UPDATE accounts SET balance = balance + ? WHERE id = ? AND user_id = ?`)
      .run(tx.amount, tx.account_id, tx.user_id);
  }
}

// ── Accounts ──────────────────────────────────────────────────────────────────

export function getAccounts(userId: string): Account[] {
  return db.prepare(`SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC`).all(userId) as Account[];
}

export function insertAccount(account: Omit<Account, "user_id"> & { user_id: string }): void {
  db.prepare(`INSERT INTO accounts (id, user_id, name, type, balance, note) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(account.id, account.user_id, account.name, account.type, account.balance, account.note);
}

export function updateAccountBalance(id: string, userId: string, balance: number): void {
  db.prepare(`UPDATE accounts SET balance = ? WHERE id = ? AND user_id = ?`).run(balance, id, userId);
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
