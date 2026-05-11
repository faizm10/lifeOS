import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.NODE_ENV === "production"
  ? "/data/auth.db"
  : path.join(process.cwd(), "auth.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    date        TEXT NOT NULL,
    merchant    TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category    TEXT NOT NULL,
    amount      REAL NOT NULL,
    account_id  TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bills (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    logo        TEXT NOT NULL DEFAULT '',
    amount      REAL NOT NULL,
    due         TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'scheduled',
    recurring   TEXT NOT NULL DEFAULT 'monthly',
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS wishlist (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    price       REAL NOT NULL DEFAULT 0,
    priority    TEXT NOT NULL DEFAULT 'med',
    note        TEXT NOT NULL DEFAULT '',
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS goals (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    target      REAL NOT NULL,
    saved       REAL NOT NULL DEFAULT 0,
    monthly     REAL NOT NULL DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS journal_entries (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    date        TEXT NOT NULL,
    mood        INTEGER NOT NULL DEFAULT 3,
    title       TEXT NOT NULL DEFAULT '',
    body        TEXT NOT NULL DEFAULT '',
    tags        TEXT NOT NULL DEFAULT '[]',
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS wins (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    date        TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'Shipped',
    title       TEXT NOT NULL,
    body        TEXT NOT NULL DEFAULT '',
    tags        TEXT NOT NULL DEFAULT '[]',
    pinned      INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sports_log (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    date        TEXT NOT NULL,
    type        TEXT NOT NULL,
    name        TEXT NOT NULL,
    metric      TEXT NOT NULL DEFAULT '',
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS media_items (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    type        TEXT NOT NULL,
    title       TEXT NOT NULL,
    author      TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'reading',
    rating      INTEGER,
    created_at  TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS accounts (
    id           TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL,
    name         TEXT NOT NULL,
    type         TEXT NOT NULL DEFAULT 'Checking',
    balance      REAL NOT NULL DEFAULT 0,
    credit_limit REAL,
    note         TEXT NOT NULL DEFAULT '',
    created_at   TEXT DEFAULT (datetime('now'))
  );
`);

// Migrate existing installs
try { db.exec(`ALTER TABLE transactions ADD COLUMN account_id TEXT`); } catch {}
try { db.exec(`ALTER TABLE accounts ADD COLUMN credit_limit REAL`); } catch {}

export default db;
