-- Schema
CREATE TABLE IF NOT EXISTS listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  lat REAL,
  lng REAL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Seed (optional)
INSERT INTO listings (title, description, lat, lng) VALUES
  ('Test Listing A', 'First sample listing', -37.8136, 144.9631),
  ('Test Listing B', 'Second sample listing', -33.8688, 151.2093);
