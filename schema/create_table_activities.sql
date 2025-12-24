CREATE TABLE activities (
  activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  activity TEXT NOT NULL,
  type_general TEXT NOT NULL,
  type_activity TEXT NOT NULL,
  time INTEGER,
  file TEXT,
  shadow_file TEXT,
  comment TEXT,
  items TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

