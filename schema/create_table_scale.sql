CREATE TABLE scales (
  scale_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER DEFAULT 0,
  scale TEXT NOT NULL,
  min_value REAL NOT NULL,
  max_value REAL NOT NULL
);
