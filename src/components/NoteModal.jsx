import React, { useEffect, useState } from 'react';

const categories = [
  'Materi Kuliah',
  'Tugas',
  'Skripsi',
  'Ide',
  'Penting',
  'Pribadi'
];

const progressOptions = [
  'Rencana Kerja',
  'Sedang Dikerjakan',
  'Selesai'
];

function NoteModal({ note, onSave, onClose }) {
  const editing = Boolean(note);

  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'Materi Kuliah',
    progress: 'Rencana Kerja',
    courseName: ''
  });

  const [error, setError] = useState('');

  // =========================================================
  // TANGGAL
  // =========================================================

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // =========================================================
  // MENGISI FORM SAAT EDIT
  // =========================================================

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title || '',
        body: note.body || '',
        category: note.category || 'Materi Kuliah',
        progress: note.progress || 'Rencana Kerja',
        courseName: note.courseName || ''
      });
    } else {
      setForm({
        title: '',
        body: '',
        category: 'Materi Kuliah',
        progress: 'Rencana Kerja',
        courseName: ''
      });
    }

    setError('');
  }, [note]);

  // =========================================================
  // HANDLE PERUBAHAN INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value
      };

      // Jika kategori berubah
      if (name === 'category') {
        if (value === 'Tugas') {
          updated.progress =
            previous.progress || 'Rencana Kerja';
        } else {
          updated.progress = null;
        }
      }

      return updated;
    });

    setError('');
  };

  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanTitle = form.title.trim();
    const cleanBody = form.body.trim();
    const cleanCourseName = form.courseName.trim();

    // Validasi judul
    if (cleanTitle.length < 3) {
      setError(
        'Judul minimal wajib terdiri dari 3 karakter.'
      );
      return;
    }

    // Validasi isi
    if (cleanBody.length < 10) {
      setError(
        'Substansi isi dokumen minimal wajib terdiri dari 10 karakter.'
      );
      return;
    }

    // Validasi mata kuliah
    if (
      form.category === 'Materi Kuliah' &&
      cleanCourseName.length === 0
    ) {
      setError('Nama mata kuliah wajib diisi.');
      return;
    }

    const payload = {
      ...form,
      title: cleanTitle,
      body: cleanBody,
      courseName: cleanCourseName
    };

    // Judul otomatis untuk materi kuliah
    if (
      form.category === 'Materi Kuliah' &&
      cleanCourseName.length > 0
    ) {
      payload.title =
        '[' + cleanCourseName + '] ' + cleanTitle;
    }

    // Progress hanya digunakan untuk Tugas
    if (form.category !== 'Tugas') {
      payload.progress = null;
    } else {
      payload.progress =
        form.progress || 'Rencana Kerja';
    }

    onSave(payload);
  };

  // =========================================================
  // TEMA BERDASARKAN KATEGORI
  // =========================================================

  const getEditorTheme = () => {
    switch (form.category) {
      case 'Materi Kuliah':
        return {
          bg: '#fefcf0',
          border: '#e6dbb3',
          accent: '#8b5e3c'
        };

      case 'Ide':
        return {
          bg: '#f5faff',
          border: '#cbdcf7',
          accent: '#2980b9'
        };

      case 'Penting':
        return {
          bg: '#fff5f5',
          border: '#fadbd8',
          accent: '#e74c3c'
        };

      case 'Pribadi':
        return {
          bg: '#fbf5ff',
          border: '#ebdef0',
          accent: '#8e44ad'
        };

      default:
        return {
          bg: '#ffffff',
          border: '#e2eaf4',
          accent: '#155ec9'
        };
    }
  };

  const theme = getEditorTheme();

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      {/* BACKDROP */}
      <button
        className="modal__backdrop"
        type="button"
        aria-label="Tutup"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div
        className="modal__card"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.bg,
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="modal__heading"
          style={{
            flexShrink: 0,
            borderBottom: '1px dashed ' + theme.border,
            paddingBottom: '15px'
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{
                color: theme.accent
              }}
            >
              {editing
                ? 'PERBARUI REPOSITORI'
                : 'ENTRI DOKUMEN BARU'}
            </span>

            <h2 id="note-modal-title">
              {editing
                ? 'Modifikasi Dokumen'
                : 'Informasi apa yang ingin Anda amankan?'}
            </h2>
          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="form-alert form-alert--error"
            style={{
              flexShrink: 0
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================== */}

        <form
          className="note-form"
          onSubmit={handleSubmit}
          style={{
            overflowY: 'auto',
            padding: '20px 8px 20px 0',
            flex: 1,
            minHeight: 0
          }}
        >
          {/* =================================================
              KATEGORI
          ================================================== */}

          <label>
            Klasifikasi Kategori

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                border: '1px solid ' + theme.border
              }}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </label>

          {/* =================================================
              MATERI KULIAH
          ================================================== */}

          {form.category === 'Materi Kuliah' && (
            <div
              style={{
                background: '#fefcf0',
                border: '2px dashed #e6dbb3',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                position: 'relative',
                boxShadow:
                  'inset 0 0 10px rgba(0,0,0,0.02)'
              }}
            >
              {/* Jepitan */}
              <div
                style={{
                  display: 'flex',
                  gap: '25px',
                  position: 'absolute',
                  top: '-10px',
                  left: '20px'
                }}
              >
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      style={{
                        width: '12px',
                        height: '16px',
                        background: '#bdc3c7',
                        borderRadius: '6px',
                        border: '2px solid #fff'
                      }}
                    />
                  )
                )}
              </div>

              {/* Header lembar kuliah */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#8e8d86',
                  marginBottom: '15px',
                  fontWeight: 'bold',
                  borderBottom:
                    '1px solid #ebdcb2',
                  paddingBottom: '6px',
                  marginTop: '5px'
                }}
              >
                <span>
                  📅 {currentDate}
                </span>

                <span>
                  📑 Lembar Kuliah
                </span>
              </div>

              {/* Mata kuliah */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '10px'
                }}
              >
                <div
                  style={{
                    flex: 1
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#615f57',
                      display: 'block',
                      marginBottom: '4px'
                    }}
                  >
                    Mata Kuliah
                  </span>

                  <input
                    type="text"
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    placeholder="Misal: Pemrograman Web, Kalkulus..."
                    style={{
                      background: '#fff',
                      border:
                        '1px solid #ebdcb2',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    required={
                      form.category ===
                      'Materi Kuliah'
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              IDE
          ================================================== */}

          {form.category === 'Ide' && (
            <div
              style={{
                background: '#eef7ff',
                border: '2px solid #cbdcf7',
                borderRadius: '16px',
                padding: '15px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#2980b9',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>
                  💡 Halaman Brainstorming Gagasan
                  Kreatif
                </span>
              </div>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: '11px',
                  color: '#7f8c8d'
                }}
              >
                Gunakan lembar kotak blueprint di
                bawah ini untuk mencatat ide liar
                Anda.
              </p>
            </div>
          )}

          {/* =================================================
              PENTING
          ================================================== */}

          {form.category === 'Penting' && (
            <div
              style={{
                background: '#fff0f0',
                border: '2px solid #f5b7b1',
                borderRadius: '16px',
                padding: '15px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#c0392b',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>
                  📌 DOKUMEN SKALA PRIORITAS UTAMA
                </span>
              </div>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: '11px',
                  color: '#c0392b',
                  opacity: 0.8
                }}
              >
                Pastikan pengumuman atau deadline
                mendesak dicatat secara presisi.
              </p>
            </div>
          )}

          {/* =================================================
              PRIBADI
          ================================================== */}

          {form.category === 'Pribadi' && (
            <div
              style={{
                background: '#fdf2ff',
                border: '2px dashed #e8daf0',
                borderRadius: '16px',
                padding: '15px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#8e44ad',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>
                  🔒 Lembar Catatan Privasi Internal
                </span>
              </div>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: '11px',
                  color: '#9b59b6'
                }}
              >
                Hanya ditujukan untuk keperluan
                dokumentasi pribadi Anda.
              </p>
            </div>
          )}

          {/* =================================================
              STATUS TUGAS
          ================================================== */}

          {form.category === 'Tugas' && (
            <label
              style={{
                animation: 'fadeIn 0.2s ease'
              }}
            >
              Status Alur Kerja Progres

              <select
                name="progress"
                value={
                  form.progress || 'Rencana Kerja'
                }
                onChange={handleChange}
              >
                {progressOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* =================================================
              JUDUL
          ================================================== */}

          <label>
            Judul Dokumen / Topik Bahasan

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ketik judul bahasan utama dokumen..."
              maxLength={60}
              required
              style={{
                border:
                  '1px solid ' + theme.border
              }}
            />

            <small
              style={{
                textAlign: 'right',
                display: 'block'
              }}
            >
              Sisa kuota batas:{' '}
              {60 - form.title.length} karakter
            </small>
          </label>

          {/* =================================================
              ISI CATATAN
          ================================================== */}

          <label>
            Substansi Konten Catatan

            <div
              style={{
                position: 'relative'
              }}
            >
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                placeholder="Tuangkan rincian tulisan secara lengkap di sini..."
                rows={9}
                required
                style={{
                  backgroundColor: theme.bg,

                  backgroundImage:
                    form.category ===
                    'Materi Kuliah'
                      ? 'linear-gradient(#e6dbb3 1px, transparent 1px)'
                      : form.category === 'Ide'
                        ? 'linear-gradient(90deg, rgba(41,128,185,0.03) 1px, transparent 1px), linear-gradient(rgba(41,128,185,0.03) 1px, transparent 1px)'
                        : 'none',

                  backgroundSize:
                    form.category === 'Ide'
                      ? '20px 20px'
                      : '100% 32px',

                  lineHeight: '32px',
                  padding: '12px 16px',

                  border:
                    '1px solid ' + theme.border,

                  borderRadius: '12px',
                  fontFamily: 'inherit',
                  transition:
                    'all 0.3s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
          </label>

          {/* =================================================
              TOMBOL AKSI
          ================================================== */}

          <div
            className="modal__actions"
            style={{
              position: 'sticky',
              bottom: 0,

              // TIDAK menggunakan ${theme.border}
              background: theme.bg,

              paddingTop: '15px',
              paddingBottom: '5px',
              marginTop: '20px',

              // Dibuat menggunakan + agar tidak ada
              // template literal yang dapat menyebabkan
              // error parser
              borderTop:
                '1px solid ' + theme.border,

              zIndex: 10,
              transition:
                'background-color 0.3s ease',

              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            <button
              className="button button--secondary"
              type="button"
              onClick={onClose}
            >
              Batalkan
            </button>

            <button
              className="button button--primary"
              type="submit"
              style={{
                backgroundColor: theme.accent,
                borderColor: theme.accent
              }}
            >
              {editing
                ? 'Terapkan Perubahan'
                : 'Sematkan Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;