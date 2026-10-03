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
  // Tambahkan state baru ini untuk melacak sub-halaman Beranda, Fitur, atau Tentang
  const [subPage, setSubPage] = useState('beranda'); 
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    initializeUserNotes(user.id, getInitialData());
    setNotes(getNotes(user.id));
  }, [user]);

  const persistNotes = (nextNotes) => {
    setNotes(nextNotes);
    if (user) {
      saveNotes(user.id, nextNotes);
    }
  };

  const handleNavigate = (destination, subDestination = 'beranda') => {
    if (destination === 'dashboard' && !user) {
      setPage('login');
      return;
    }

    setPage(destination);
    setSubPage(subDestination); // Set target sub-halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = (data) => {
    const result = registerUser(data);
    if (result.ok) {
      setUser(result.user);
      setPage('dashboard');
    }
    return result;
  };

  const handleLogin = (data) => {
    const result = loginUser(data);
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

  const saveNote = (data) => {
    const now = new Date().toISOString();

    if (editingNote) {
      persistNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                ...data,
                progress: data.category === 'Tugas' ? (note.progress || 'Rencana Kerja') : null,
                updatedAt: now
              }
            : note
        )
      );
    } else {
      persistNotes([
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
      ]);
    }

    setModalOpen(false);
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    const note = notes.find((item) => item.id === id);
    const approved = window.confirm(`Hapus dokumen "${note?.title || 'ini'}"?`);
    if (approved) {
      persistNotes(notes.filter((item) => item.id !== id));
    }
  };

  const handleUpdateProgress = (id, newProgress) => {
    persistNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              progress: newProgress,
              updatedAt: new Date().toISOString()
            }
          : note
      )
    );
  };

  const togglePin = (id) => {
    persistNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
              updatedAt: new Date().toISOString()
            }
          : note
      )
    );
  };

  // KODE TERINTEGRASI: Fungsi pengarsipan catatan agar sinkron dengan Dashboard UI
  const toggleArchive = (id) => {
    persistNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, archived: !note.archived, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  return (
    <div className="app">
      {/* Kirim subPage dan fungsi handleNavigate ke Navbar */}
      <Navbar
        user={user}
        subPage={subPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Kirim subPage aktif ke komponen LandingPage */}
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
          onArchive={toggleArchive} // 
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
