CREATE TABLE topics (
  topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER DEFAULT 0,
  topic TEXT NOT NULL,
  file TEXT,
  shadow_file TEXT,
  content TEXT,
  order_by INTEGER,
  visible BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
