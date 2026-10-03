const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const router = express.Router();

function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// 1. Endpoint Registrasi Akun Baru (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Cek apakah email sudah dipakai orang lain di tabel MySQL
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.json({ ok: false, message: 'Email tersebut sudah terdaftar.' });
    }

    // Mengacak password menggunakan Bcrypt sebelum disimpan demi keamanan data
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = createId('user');

    await db.query(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name.trim(), cleanEmail, hashedPassword]
    );

    res.json({ ok: true, user: { id, name: name.trim(), email: cleanEmail } });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Terjadi eror internal pada server.', error: error.message });
  }
});

// 2. Endpoint Masuk Akun (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Cari user berdasarkan emailnya
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (rows.length === 0) {
      return res.json({ ok: false, message: 'Email atau password belum sesuai.' });
    }

    const user = rows[0];
    
    // Membandingkan password ketik dengan password acak di database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ ok: false, message: 'Email atau password belum sesuai.' });
    }

    res.json({ ok: true, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Terjadi kesalahan sistem login pada server.' });
  }
});

module.exports = router;
