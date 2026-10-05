import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import NoteModal from './NoteModal';
import { getInitialData } from '../utils';
import {
  createId,
  getCurrentUser,
  getNotes,
  initializeUserNotes,
  loginUser,
  logoutUser,
  registerUser,
  saveNotes
} from '../utils/storage';

function App() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [page, setPage] = useState(() => (getCurrentUser() ? 'dashboard' : 'home'));
  const [subPage, setSubPage] = useState('beranda'); 
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // PENGAMBILAN CATATAN: Mengambil catatan awal berbasis Async/Await dari MySQL Docker
  useEffect(() => {
    async function fetchNotes() {
      if (!user) {
        setNotes([]);
        return;
      }
      initializeUserNotes(user.id, getInitialData());
      const dataNotes = await getNotes(user.id);
      setNotes(dataNotes);
    }
    fetchNotes();
  }, [user]);

  // SINKRONISASI DATA: Menyelaraskan fungsi penyimpan massal ke sistem REST API Cloud MySQL
  const persistNotes = async (nextNotes) => {
    setNotes(nextNotes);
    if (user) {
      await saveNotes(user.id, nextNotes);
    }
  };

  const handleNavigate = (destination, subDestination = 'beranda') => {
    if (destination === 'dashboard' && !user) {
      setPage('login');
      return;
    }

    setPage(destination);
    setSubPage(subDestination); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // REGISTER ENGINE: Fungsi pendaftaran akun baru berbasis Async/Await
  const handleRegister = async (data) => {
    const result = await registerUser(data);
    if (result.ok) {
      setUser(result.user);
      setPage('dashboard');
    }
    return result;
  };

  // LOGIN ENGINE: Fungsi masuk akun divalidasi dengan enkripsi Bcrypt di backend
  const handleLogin = async (data) => {
    const result = await loginUser(data);
    if (result.ok) {
      setUser(result.user);
      setPage('dashboard');
    }
    return result;
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setPage('home');
    setSubPage('beranda');
    setModalOpen(false);
    setEditingNote(null);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  // =========================================================================
  // LOGIKA UTAMA PERBAIKAN: MODIFIKASI DATA & SINKRONISASI GRAFIK SECARA DINAMIS
  // =========================================================================
  const saveNote = async (data) => {
    const now = new Date().toISOString();

    if (editingNote) {
      // KODE PERBAIKAN MUTAKHIR: Memastikan 'data.progress' (bukan note.progress) yang dibaca saat catatannya diperbarui
      const updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? {
              ...note,
              ...data,
              progress: data.category === 'Tugas' ? (data.progress || 'Rencana Kerja') : null,
              updatedAt: now
            }
          : note
      );
      await persistNotes(updatedNotes);
    } else {
      const newNotes = [
        {
          id: createId('note'),
          ...data,
          createdAt: now,
          updatedAt: now,
          progress: data.category === 'Tugas' ? 'Rencana Kerja' : null,
          archived: false,
          pinned: false
        },
        ...notes
      ];
      await persistNotes(newNotes);
    }

    setModalOpen(false);
    setEditingNote(null);
  };
  // =========================================================================

  const deleteNote = async (id) => {
    const note = notes.find((item) => item.id === id);
    const approved = window.confirm(`Hapus dokumen "${note?.title || 'ini'}"?`);
    if (approved) {
      const remainingNotes = notes.filter((item) => item.id !== id);
      await persistNotes(remainingNotes);
    }
  };

  const handleUpdateProgress = async (id, newProgress) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            progress: newProgress,
            updatedAt: new Date().toISOString()
          }
        : note
    );
    await persistNotes(updatedNotes);
  };

  const togglePin = async (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            pinned: !note.pinned,
            updatedAt: new Date().toISOString()
          }
        : note
    );
    await persistNotes(updatedNotes);
  };

  const toggleArchive = async (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? { ...note, archived: !note.archived, updatedAt: new Date().toISOString() }
        : note
    );
    await persistNotes(updatedNotes);
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        subPage={subPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {page === 'home' && <LandingPage subPage={subPage} onNavigate={handleNavigate} />}

      {page === 'login' && !user && (
        <AuthPage
          mode="login"
          onSubmit={handleLogin}
          onNavigate={handleNavigate}
        />
      )}

      {page === 'register' && !user && (
        <AuthPage
          mode="register"
          onSubmit={handleRegister}
          onNavigate={handleNavigate}
        />
      )}

      {user && page === 'dashboard' && (
        <Dashboard
          user={user}
          notes={notes}
          onOpenCreate={openCreateModal}
          onEdit={openEditModal}
          onDelete={deleteNote}
          onUpdateProgress={handleUpdateProgress}
          onPin={togglePin}
          onArchive={toggleArchive} 
        />
      )}

      {!user && page === 'dashboard' && (
        <AuthPage
          mode="login"
          onSubmit={handleLogin}
          onNavigate={handleNavigate}
        />
      )}

      {modalOpen && (
        <NoteModal
          note={editingNote}
          onSave={saveNote}
          onClose={() => {
            setModalOpen(false);
            setEditingNote(null);
          }}
        />
      )}

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <div className="brand brand--footer">
              <span className="brand__mark">SD</span>
              <span>StudyDesk</span>
            </div>
            <p>Ruang catatan belajar yang sederhana dan terorganisir.</p>
          </div>
          <span className="site-footer__note">React · MySQL & Containerized App</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
