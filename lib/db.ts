import Database from "better-sqlite3";
import { ensureDatabaseDirectory, getDatabasePath } from "./db-path";

const dbPath = getDatabasePath();
ensureDatabaseDirectory(dbPath);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image         TEXT,
    createdAt     TEXT NOT NULL,
    updatedAt     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS session (
    id          TEXT PRIMARY KEY,
    expiresAt   TEXT NOT NULL,
    token       TEXT NOT NULL UNIQUE,
    createdAt   TEXT NOT NULL,
    updatedAt   TEXT NOT NULL,
    ipAddress   TEXT,
    userAgent   TEXT,
    userId      TEXT NOT NULL REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS account (
    id                      TEXT PRIMARY KEY,
    accountId               TEXT NOT NULL,
    providerId              TEXT NOT NULL,
    userId                  TEXT NOT NULL REFERENCES user(id),
    accessToken             TEXT,
    refreshToken            TEXT,
    idToken                 TEXT,
    accessTokenExpiresAt    TEXT,
    refreshTokenExpiresAt   TEXT,
    scope                   TEXT,
    password                TEXT,
    createdAt               TEXT NOT NULL,
    updatedAt               TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification (
    id          TEXT PRIMARY KEY,
    identifier  TEXT NOT NULL,
    value       TEXT NOT NULL,
    expiresAt   TEXT NOT NULL,
    createdAt   TEXT,
    updatedAt   TEXT
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    display_name  TEXT NOT NULL,
    aliases       TEXT NOT NULL DEFAULT '',
    photo_url     TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'active',
    tags          TEXT NOT NULL DEFAULT '',
    notes         TEXT NOT NULL DEFAULT '',
    importance    REAL NOT NULL DEFAULT 0.5,
    created_at    TEXT NOT NULL,
    updated_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS signals (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    subject_id    TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    type          TEXT NOT NULL DEFAULT 'observation',
    content       TEXT NOT NULL,
    source        TEXT NOT NULL DEFAULT 'manual',
    observed_at   TEXT NOT NULL,
    confidence    REAL NOT NULL DEFAULT 1.0,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subject_traits (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    subject_id    TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    dimension     TEXT NOT NULL,
    value         TEXT NOT NULL,
    source        TEXT NOT NULL DEFAULT 'manual',
    confidence    REAL NOT NULL DEFAULT 1.0,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subject_relationships (
    id                  TEXT PRIMARY KEY,
    user_id             TEXT NOT NULL,
    from_subject_id     TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    to_subject_id       TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    relationship_type   TEXT NOT NULL DEFAULT 'friend',
    strength            REAL NOT NULL DEFAULT 0.5,
    notes               TEXT NOT NULL DEFAULT '',
    created_at          TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dossier_sections (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    subject_id    TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    section_key   TEXT NOT NULL,
    content       TEXT NOT NULL DEFAULT '',
    updated_at    TEXT NOT NULL,
    UNIQUE(user_id, subject_id, section_key)
  );

  CREATE TABLE IF NOT EXISTS ingest_batches (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL,
    raw_text      TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ingest_suggestions (
    id                TEXT PRIMARY KEY,
    batch_id          TEXT NOT NULL REFERENCES ingest_batches(id) ON DELETE CASCADE,
    suggestion_type   TEXT NOT NULL,
    payload           TEXT NOT NULL,
    accepted          INTEGER,
    created_at        TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects(user_id);
  CREATE INDEX IF NOT EXISTS idx_signals_subject ON signals(subject_id);
  CREATE INDEX IF NOT EXISTS idx_signals_user ON signals(user_id);
  CREATE INDEX IF NOT EXISTS idx_traits_subject ON subject_traits(subject_id);
  CREATE INDEX IF NOT EXISTS idx_relationships_user ON subject_relationships(user_id);
`);

export default db;
