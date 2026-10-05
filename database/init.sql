CREATE DATABASE IF NOT EXISTS studydesk_db;
USE studydesk_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,      -- Diubah ke VARCHAR agar elastis menerima teks kategori
  course_name VARCHAR(150) DEFAULT NULL,
  progress VARCHAR(50) DEFAULT NULL,   -- Diubah ke VARCHAR agar elastis menerima status tugas
  pinned BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  due_date VARCHAR(50) DEFAULT NULL,   -- KODE PERBAIKAN: Kolom wajib penampung Deadline
  shared_with VARCHAR(150) DEFAULT NULL, -- KODE PERBAIKAN: Kolom wajib penampung Email Teman
  created_at VARCHAR(100) NOT NULL,
  updated_at VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
