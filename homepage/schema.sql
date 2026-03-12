-- Waitlist table for StoaBase
CREATE TABLE IF NOT EXISTS waitlist (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  email     TEXT    NOT NULL UNIQUE,
  name      TEXT,
  lang      TEXT    DEFAULT 'en',
  source    TEXT    DEFAULT 'homepage',
  created_at TEXT   DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
