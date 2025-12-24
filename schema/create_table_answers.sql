CREATE TABLE answers (
  answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER DEFAULT 0,
  subject_id INTEGER DEFAULT 0,
  topic_id INTEGER DEFAULT 0,
  activity_id INTEGER DEFAULT 0,
  student_id INTEGER DEFAULT 0,
  answer TEXT,
  file TEXT,
  shadow_file TEXT,
  nota REAL,
  performance TEXT,
  percentage REAL,
  comment TEXT,
  date_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
