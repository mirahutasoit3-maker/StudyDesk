import React, { useEffect, useState } from 'react';

// =========================================================
// DATA KATEGORI
// =========================================================

const categories = [
  'Materi Kuliah',
  'Tugas',
  'Skripsi',
  'Ide',
  'Penting',
  'Pribadi'
];

// =========================================================
// DATA PROGRESS TUGAS
// =========================================================

const progressOptions = [
  'Rencana Kerja',
  'Sedang Dikerjakan',
  'Selesai'
];

// =========================================================
// COMPONENT NOTE MODAL
// =========================================================

function NoteModal({ note, onSave, onClose }) {
  const editing = Boolean(note);

  // =======================================================
  // STATE FORM
  // =======================================================

  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'Materi Kuliah',
    progress: 'Rencana Kerja',
    courseName: '',
    dueDate: '',
    sharedWith: ''
  });

  const [error, setError] = useState('');

  // =======================================================
  // MENGISI FORM SAAT EDIT
  // =======================================================

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title || '',
        body: note.body || '',
        category: note.category || 'Materi Kuliah',
        progress: note.progress || 'Rencana Kerja',
        courseName: note.courseName || '',
        dueDate: note.dueDate || '',
        sharedWith: note.sharedWith || ''
      });
    } else {
      setForm({
        title: '',
        body: '',
        category: 'Materi Kuliah',
        progress: 'Rencana Kerja',
        courseName: '',
        dueDate: '',
        sharedWith: ''
      });
    }

    setError('');
  }, [note]);

  // =======================================================
  // HANDLE PERUBAHAN INPUT
  // =======================================================

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
          updated.dueDate = '';
        }
      }

      return updated;
    });

    setError('');
  };

  // =======================================================
  // SUBMIT FORM
  // =======================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    // Membersihkan input
    const cleanTitle = form.title.trim();
    const cleanBody = form.body.trim();
    const cleanCourseName = form.courseName.trim();
    const cleanSharedWith = form.sharedWith.trim().toLowerCase();

    // -------------------------------------------------------
    // VALIDASI JUDUL
    // -------------------------------------------------------

    if (cleanTitle.length < 3) {
      setError(
        'Judul minimal wajib terdiri dari 3 karakter.'
      );
      return;
    }

    // -------------------------------------------------------
    // VALIDASI ISI
    // -------------------------------------------------------

    if (cleanBody.length < 10) {
      setError(
        'Substansi isi dokumen minimal wajib terdiri dari 10 karakter.'
      );
      return;
    }

    // -------------------------------------------------------
    // VALIDASI MATA KULIAH
    // -------------------------------------------------------

    if (
      form.category === 'Materi Kuliah' &&
      cleanCourseName.length === 0
    ) {
      setError('Nama mata kuliah wajib diisi.');
      return;
    }

    // -------------------------------------------------------
    // VALIDASI DEADLINE TUGAS
    // -------------------------------------------------------

    if (form.category === 'Tugas' && !form.dueDate) {
      setError(
        'Tanggal tenggat waktu (deadline) wajib ditentukan.'
      );
      return;
    }

    // =======================================================
    // MEMBUAT DATA YANG AKAN DISIMPAN
    // =======================================================

    const payload = {
      ...form,
      title: cleanTitle,
      body: cleanBody,
      courseName: cleanCourseName,
      sharedWith: cleanSharedWith || null
    };

    // -------------------------------------------------------
    // JUDUL OTOMATIS UNTUK MATERI KULIAH
    // -------------------------------------------------------

    if (
      form.category === 'Materi Kuliah' &&
      cleanCourseName.length > 0
    ) {
      payload.title = `[${cleanCourseName}] ${cleanTitle}`;
    }

    // -------------------------------------------------------
    // PROGRESS HANYA DIGUNAKAN UNTUK TUGAS
    // -------------------------------------------------------

    if (form.category !== 'Tugas') {
      payload.progress = null;
      payload.dueDate = '';
    } else {
      payload.progress =
        form.progress || 'Rencana Kerja';
    }

    // -------------------------------------------------------
    // KIRIM DATA KE COMPONENT PARENT
    // -------------------------------------------------------

    onSave(payload);
  };

  // =======================================================
  // TEMA BERDASARKAN KATEGORI
  // =======================================================

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

      case 'Skripsi':
        return {
          bg: '#f5f5ff',
          border: '#d6d6f5',
          accent: '#5b5bb5'
        };

      case 'Tugas':
        return {
          bg: '#f8fbff',
          border: '#c9dff5',
          accent: '#155ec9'
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

  // =======================================================
  // TAMPILAN MODAL
  // =======================================================

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      {/* =================================================
          BACKDROP
      ================================================= */}

      <button
        className="modal__backdrop"
        type="button"
        aria-label="Tutup"
        onClick={onClose}
      />

      {/* =================================================
          MODAL CARD
      ================================================= */}

      <div
        className="modal__card"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.bg,
          transition: 'background-color 0.3s ease',
          padding: '24px',
          width: '100%',
          maxWidth: '540px',
          boxSizing: 'border-box'
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="modal__heading"
          style={{
            flexShrink: 0,
            borderBottom: `1px dashed ${theme.border}`,
            paddingBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
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

          {/* TOMBOL CLOSE */}

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            style={{
              fontSize: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            className="form-alert form-alert--error"
            style={{
              flexShrink: 0,
              background: '#fff5f5',
              color: '#e74c3c',
              padding: '10px',
              borderRadius: '8px',
              marginTop: '15px',
              border: '1px solid #fadbd8',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="note-form"
          onSubmit={handleSubmit}
          style={{
            overflowY: 'auto',
            padding: '15px 0',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* =================================================
              KATEGORI
          ================================================= */}

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontWeight: '500'
            }}
          >
            Klasifikasi Kategori

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                border: `1px solid ${theme.border}`,
                padding: '10px',
                borderRadius: '8px',
                width: '100%',
                background: '#fff'
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
          ================================================= */}

          {form.category === 'Materi Kuliah' && (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              Nama Mata Kuliah

              <input
                type="text"
                name="courseName"
                value={form.courseName}
                onChange={handleChange}
                placeholder="Contoh: Pemrograman Web, DevOps..."
                style={{
                  border: `1px solid ${theme.border}`,
                  padding: '10px',
                  borderRadius: '8px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </label>
          )}

          {/* =================================================
              PROGRESS TUGAS
          ================================================= */}

          {form.category === 'Tugas' && (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              Status Progres Tugas

              <select
                name="progress"
                value={form.progress || 'Rencana Kerja'}
                onChange={handleChange}
                style={{
                  border: `1px solid ${theme.border}`,
                  padding: '10px',
                  borderRadius: '8px',
                  width: '100%',
                  background: '#fff'
                }}
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
              DEADLINE TUGAS
          ================================================= */}

          {form.category === 'Tugas' && (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              Tanggal Tenggat Waktu (Deadline)

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                style={{
                  border: `1px solid ${theme.border}`,
                  padding: '10px',
                  borderRadius: '8px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </label>
          )}

          {/* =================================================
              JUDUL CATATAN
          ================================================= */}

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontWeight: '500'
            }}
          >
            Judul Catatan

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masukkan tajuk utama berkas..."
              style={{
                border: `1px solid ${theme.border}`,
                padding: '10px',
                borderRadius: '8px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </label>

          {/* =================================================
              ISI DOKUMEN
          ================================================= */}

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontWeight: '500',
              flex: 1
            }}
          >
            Substansi Isi Dokumen

            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Ketik isi rangkuman, teks, atau detail materi kuliah Anda di sini..."
              style={{
                border: `1px solid ${theme.border}`,
                padding: '10px',
                borderRadius: '8px',
                flex: 1,
                minHeight: '120px',
                resize: 'vertical',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </label>

          {/* =================================================
              SHARING / KOLABORASI
          ================================================= */}

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontWeight: '500',
              borderTop: `1px dashed ${theme.border}`,
              paddingTop: '15px'
            }}
          >
            Bagikan ke Rekan Mahasiswa
            <span
              style={{
                fontSize: '12px',
                fontWeight: '400',
                color: '#777'
              }}
            >
              Masukkan email rekan mahasiswa - Opsional
            </span>

            <input
              type="email"
              name="sharedWith"
              value={form.sharedWith}
              onChange={handleChange}
              placeholder="contoh: ryan@email.com"
              style={{
                border: `1px solid ${theme.border}`,
                padding: '10px',
                borderRadius: '8px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </label>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '10px',
              flexShrink: 0,
              paddingTop: '5px'
            }}
          >
            {/* TOMBOL BATAL */}

            <button
              className="button button--secondary"
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                background: '#fff'
              }}
            >
              Batal
            </button>

            {/* TOMBOL SIMPAN */}

            <button
              className="button button--primary"
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: theme.accent,
                color: '#fff',
                border: 'none'
              }}
            >
              {editing
                ? 'Simpan Perubahan'
                : 'Amankan Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================
// EXPORT COMPONENT
// =========================================================

export default NoteModal;