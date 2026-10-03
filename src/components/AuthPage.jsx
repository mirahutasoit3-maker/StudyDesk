import React, { useState } from 'react';

function AuthPage({ mode, onSubmit, onNavigate }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegister && form.name.trim().length < 2) {
      setError('Nama wajib diisi minimal 2 karakter.');
      return;
    }

    if (form.password.length < 6) {
      setError('Kata sandi minimal terdiri atas 6 karakter.');
      return;
    }

    if (isRegister && form.password !== form.confirmPassword) {
      setError('Kombinasi kata sandi konfirmasi tidak cocok.');
      return;
    }

    const result = onSubmit({
      name: form.name,
      email: form.email,
      password: form.password
    });

    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="container auth-layout">
        <section className="auth-side">
          <span className="eyebrow eyebrow--light">SELAMAT DATANG DI STUDYDESK</span>
          <h1>
            {isRegister
              ? 'Mari bangun repositori dokumen personal Anda.'
              : 'Kembali kendalikan seluruh agenda belajar Anda.'}
          </h1>
          <p>
            Rangkuman perkuliahan, rincian tugas, serta gagasan kreatif tersimpan aman pada satu ruang kerja yang praktis sekaligus responsif.
          </p>

          <div className="auth-side__card">
            <span>“</span>
            <p>
              Dokumentasi yang tertata rapi mempermudah proses review dan pemahaman materi di masa mendatang.
            </p>
          </div>
        </section>

        <section className="auth-card">
          <button className="auth-back" type="button" onClick={() => onNavigate('home')}>
            ← Beranda utama
          </button>

          <div className="auth-card__heading">
            <span className="eyebrow">{isRegister ? 'REGISTRASI' : 'OTENTIKASI'}</span>
            <h2>{isRegister ? 'Aktivasi Akses Baru' : 'Masuk ke StudyDesk'}</h2>
            <p>
              {isRegister
                ? 'Lengkapi formulir di bawah ini untuk membuka ruang kerja Anda.'
                : 'Silakan masukkan alamat email beserta kata sandi terdaftar.'}
            </p>
          </div>

          {error && <div className="form-alert form-alert--error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                Nama
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap Anda"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alamat@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ketik minimal 6 karakter"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
              />
            </label>

            {isRegister && (
              <label>
                Konfirmasi Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  autoComplete="new-password"
                  required
                />
              </label>
            )}

            <button className="button button--primary auth-submit" type="submit">
              {isRegister ? 'Registrasikan Akun' : 'Akses Ruang Kerja'}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Sudah terdaftar sebagai pengguna?' : 'Belum memiliki akses kerja?'}
            {' '}
            <button type="button" onClick={() => onNavigate(isRegister ? 'login' : 'register')}>
              {isRegister ? 'Login di sini' : 'Buat akun sekarang'}
            </button>
          </p>

          <div className="local-demo-note">
            Sistem ini beroperasi menggunakan penyimpanan lokal (local storage) penjelajah untuk keperluan demonstrasi.
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
