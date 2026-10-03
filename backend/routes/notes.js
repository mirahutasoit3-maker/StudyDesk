const express = require('express');
const db = require('../config/db');

const router = express.Router();

function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// 1. Ambil semua catatan milik User tertentu (GET /api/notes/:userId)
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC',
      [req.params.userId]
    );
    
    // Normalisasi nilai bit database (0/1) kembali menjadi format boolean asli di React
    const formatted = rows.map(note => ({
      ...note,
      pinned: !!note.pinned,
      archived: !!note.archived,
      courseName: note.course_name // Pemetaan nama kolom MySQL ke properti React
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Gagal memuat daftar catatan.', error: error.message });
  }
});

// 2. Simpan atau Update Catatan Ke MySQL (POST /api/notes)
router.post('/', async (req, res) => {
  try {
    const { id, userId, title, body, category, courseName, progress, pinned, archived, createdAt, updatedAt } = req.body;
    const noteId = id || createId('note');

    // Menggunakan klausa INSERT ... ON DUPLICATE KEY UPDATE agar satu fungsi ini bisa otomatis bertindak sebagai penambah skrip baru sekaligus pengedit data lama
    await db.query(
      `INSERT INTO notes (id, user_id, title, body, category, course_name, progress, pinned, archived, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       title=?, body=?, category=?, course_name=?, progress=?, pinned=?, archived=?, updated_at=?`,
      [
        noteId, userId, title || 'Untitled', body || '', category, courseName || null, progress || null, pinned ? 1 : 0, archived ? 1 : 0, createdAt, updatedAt,
        title || 'Untitled', body || '', category, courseName || null, progress || null, pinned ? 1 : 0, archived ? 1 : 0, updatedAt
      ]
    );
    
    res.json({ ok: true, message: 'Sinkronisasi catatan berhasil.', id: noteId });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Gagal mengamankan berkas catatan.', error: error.message });
  }
});

// 3. Hapus Catatan dari MySQL (DELETE /api/notes/:id)
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ ok: true, message: 'Catatan sukses dihapus dari database.' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Gagal menghapus data dari sistem awan.' });
  }
});

module.exports = router;
