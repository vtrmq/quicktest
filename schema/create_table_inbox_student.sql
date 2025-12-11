CREATE TABLE inbox_student (
  inbox_student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER DEFAULT 0,
  course_id INTEGER DEFAULT 0,
  subject_id INTEGER DEFAULT 0,
  topic_id INTEGER DEFAULT 0,
  activity_id INTEGER DEFAULT 0,
  date_end DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
