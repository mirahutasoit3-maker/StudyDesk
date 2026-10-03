const USERS_KEY = 'StudyDesk_users_v1';
const SESSION_KEY = 'StudyDesk_session_v1';

const notesKey = (userId) => `StudyDesk_notes_v1_${userId}`;

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix = 'id') {
  if (window.crypto?.randomUUID) {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getUsers() {
  return readJSON(USERS_KEY, []);
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === cleanEmail)) {
    return {
      ok: false,
      message: 'Email tersebut sudah terdaftar.'
    };
  }

  const user = {
    id: createId('user'),
    name: name.trim(),
    email: cleanEmail,
    // Untuk demo lokal saja. Saat dipindahkan ke backend/SQL,
    // password WAJIB di-hash di server, bukan disimpan seperti ini.
    password
  };

  writeJSON(USERS_KEY, [...users, user]);
  writeJSON(SESSION_KEY, { userId: user.id });

  return {
    ok: true,
    user: sanitizeUser(user)
  };
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(
    (item) => item.email === cleanEmail && item.password === password
  );

  if (!user) {
    return {
      ok: false,
      message: 'Email atau password belum sesuai.'
    };
  }

  writeJSON(SESSION_KEY, { userId: user.id });

  return {
    ok: true,
    user: sanitizeUser(user)
  };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const session = readJSON(SESSION_KEY, null);
  if (!session?.userId) return null;

  const user = getUsers().find((item) => item.id === session.userId);
  return user ? sanitizeUser(user) : null;
}

function sanitizeUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function getNotes(userId) {
  return readJSON(notesKey(userId), []);
}

export function saveNotes(userId, notes) {
  writeJSON(notesKey(userId), notes);
}

export function initializeUserNotes(userId, notes) {
  const key = notesKey(userId);
  if (!localStorage.getItem(key)) {
    writeJSON(key, notes);
  }
}

export { createId };
