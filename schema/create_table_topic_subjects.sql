CREATE TABLE topic_subjects (
  topic_subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL
);
