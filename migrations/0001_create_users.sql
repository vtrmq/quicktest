CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  surnames TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  profile TEXT CHECK(profile IN ('A','T','S')) NOT NULL,
  photo TEXT,
  blocked TEXT DEFAULT 'S' CHECK(blocked IN ('S','N')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
