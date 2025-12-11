CREATE TABLE topics (
  topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER DEFAULT 0,
  topic TEXT NOT NULL,
  videos TEXT,
  file TEXT,
  shadow_file TEXT,
  content TEXT,
  order_by INTEGER,
  visible BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topic_subjects (
  topic_subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL
);

CREATE TABLE activities (
  course_student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  activity TEXT NOT NULL,
  type_general TEXT NOT NULL,
  type_activity TEXT NOT NULL,
  time INTEGER,
  file TEXT,
  shadow_file TEXT,
  note TEXT,
  items TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

