import React, { useMemo, useState } from 'react';
import NoteCard from './NoteCard';

const categoryOptions = ['Semua', 'Materi Kuliah', 'Tugas', 'Skripsi', 'Ide', 'Penting', 'Pribadi'];

function Dashboard({
  user,
  notes,
  onOpenCreate,
  onEdit,
  onDelete,
  onArchive,
  onPin
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Aktif');
  const [category, setCategory] = useState('Semua');

  const activeCount = notes.filter((note) => !note.archived).length;
  const archivedCount = notes.filter((note) => note.archived).length;
  const pinnedCount = notes.filter((note) => note.pinned && !note.archived).length;

  const visibleNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return notes
      .filter((note) => {
        const sameStatus =
          status === 'Semua' ||
          (status === 'Aktif' && !note.archived) ||
          (status === 'Arsip' && note.archived);

        const sameCategory = category === 'Semua' || note.category === category;
        const content = `${note.title} ${note.body} ${note.category}`.toLowerCase();

        return sameStatus && sameCategory && content.includes(keyword);
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
  }, [notes, query, status, category]);

  return (
    <main className="dashboard">
      <section className="dashboard-hero">
        <div className="container dashboard-hero__inner">
          <div>
            <span className="eyebrow">RUANG KERJA DIGITAL</span>
            <h1>Selamat datang, {user.name.split(' ')[0]}.</h1>
            <p>
              Dokumentasikan seluruh progres pembelajaran Anda di sini agar terorganisir dengan baik dan terhindar dari tumpukan berkas yang berserakan.
            </p>
          </div>

          <button className="button button--primary button--large" type="button" onClick={onOpenCreate}>
            + Dokumen Baru
          </button>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="summary-grid">
            <div className="summary-card">
              <span>Total Catatan</span>
              <strong>{notes.length}</strong>
              <small>Akumulasi dokumen terdaftar</small>
            </div>
            <div className="summary-card">
              <span>Catatan Aktif</span>
              <strong>{activeCount}</strong>
              <small>Dokumen dalam masa pakai</small>
            </div>
            <div className="summary-card">
              <span>Sematkan</span>
              <strong>{pinnedCount}</strong>
              <small>Informasi skala prioritas</small>
            </div>
            <div className="summary-card">
              <span>Arsip</span>
              <strong>{archivedCount}</strong>
              <small>Berkas yang diamankan</small>
            </div>
          </div>

          <div className="workspace-panel">
            <div className="workspace-panel__heading">
              <div>
                <span className="eyebrow">KONSOL REPOSITORI</span>
                <h2>Saring dan kelola berkas Anda.</h2>
              </div>
              <span className="result-count">{visibleNotes.length} ditemukan</span>
            </div>

            <div className="filter-bar">
              <div className="search-control">
                <span>⌕</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Telusuri judul, substansi, atau label..."
                />
              </div>

              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Aktif</option>
                <option>Arsip</option>
                <option>Semua</option>
              </select>

              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categoryOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            {visibleNotes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">✦</div>
                <h3>Tidak ada dokumen pada kriteria ini.</h3>
                <p>Silakan sesuaikan kembali parameter filter atau buat lembar baru untuk mengisi ruang kerja.</p>
                <button className="button button--primary" type="button" onClick={onOpenCreate}>
                  Buat Dokumen
                </button>
              </div>
            ) : (
              <div className="note-grid">
                {visibleNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onPin={onPin}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
