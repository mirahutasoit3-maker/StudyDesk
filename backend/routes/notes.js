const express = require('express');
const db = require('../config/db');

const router = express.Router();

function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// 1. GET: Mengambil catatan milik user itu sendiri + catatan milik orang lain yang dibagikan ke email user tersebut
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT notes.* FROM notes 
       LEFT JOIN users ON users.id = notes.user_id
       WHERE notes.user_id = ? OR notes.shared_with = (SELECT email FROM users WHERE id = ?)
       ORDER BY notes.pinned DESC, notes.updated_at DESC`,
      [req.params.userId, req.params.userId]
    );
    
    // Normalisasi pemetaan nama properti kolom MySQL (snake_case) ke format objek React (camelCase)
    const formatted = rows.map(note => ({
      id: note.id,
      userId: note.user_id,
      title: note.title,
      body: note.body,
      category: note.category,
      courseName: note.course_name,
      progress: note.progress,
      pinned: !!note.pinned,
      archived: !!note.archived,
      dueDate: note.due_date,
      sharedWith: note.shared_with,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Gagal memuat daftar catatan.', error: error.message });
  }
});

// 2. POST: Menyimpan / Mensinkronisasikan array data catatan secara massal dari React menggunakan Looping Query
router.post('/', async (req, res) => {
  try {
    const { userId, notes } = req.body;
    if (!userId) {
      return res.status(400).json({ ok: false, message: 'User ID dibutuhkan untuk sinkronisasi.' });
    }

    // Bersihkan catatan lama milik user terlebih dahulu untuk menghindari replikasi data ganda
    await db.query('DELETE FROM notes WHERE user_id = ?', [userId]);

    // Jika ada array catatan yang dikirim dari React, masukkan satu per satu ke database MySQL
    if (notes && notes.length > 0) {
      for (const note of notes) {
        await db.query(
          `INSERT INTO notes (id, user_id, title, body, category, course_name, progress, pinned, archived, due_date, shared_with, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            note.id || createId('note'),
            userId,
            note.title || 'Untitled',
            note.body || '',
            note.category || 'Materi Kuliah',
            note.courseName || null,
            note.progress || null,
            note.pinned ? 1 : 0,
            note.archived ? 1 : 0,
            note.dueDate || null,
            note.sharedWith || null,
            note.createdAt || new Date().toISOString(),
            note.updatedAt || new Date().toISOString()
          ]
        );
      }
    }

    res.json({ ok: true, message: 'Seluruh catatan berhasil dikunci permanen di MySQL Docker!' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Gagal melakukan sinkronisasi ke database.', error: error.message });
  }
});

// 3. DELETE: Menghapus satu dokumen catatan spesifik berdasarkan ID berkas
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ ok: true, message: 'Catatan sukses dihapus dari database MySQL.' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Gagal menghapus data dari sistem awan.', error: error.message });
  }
});

module.exports = router;
