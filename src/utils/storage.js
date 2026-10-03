import axios from 'axios';

// Konfigurasi dasar URL API Backend Express Anda
const API_URL = 'http://localhost:3000/api';

function createId(prefix = 'id') {
  if (window.crypto?.randomUUID) {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// 1. Mengambil data sesi pengguna dari Local Storage lokal untuk menjaga status login saat refresh
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('StudyDesk_session_v1');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// 2. Fungsi Registrasi via API Backend (Password akan di-hash otomatis di server dengan bcrypt)
export async function registerUser({ name, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password
    });
    
    if (response.data.ok) {
      localStorage.setItem('StudyDesk_session_v1', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || 'Gagal terhubung ke server pendaftaran.'
    };
  }
}

// 3. Fungsi Login via API Backend
export async function loginUser({ email, password }) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.ok) {
      localStorage.setItem('StudyDesk_session_v1', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || 'Gagal terhubung ke server otentikasi.'
    };
  }
}

// 4. Fungsi Keluar / Logout
export function logoutUser() {
  localStorage.removeItem('StudyDesk_session_v1');
}

// 5. Mengambil daftar catatan milik User tertentu dari database MySQL melalui API
export async function getNotes(userId) {
  try {
    const response = await axios.get(`${API_URL}/notes/${userId}`);
    return response.data; // Mengembalikan array catatan langsung dari MySQL
  } catch (error) {
    console.error('Gagal memuat catatan dari database:', error);
    return [];
  }
}

// 6. Menyimpan atau memperbarui satu catatan khusus ke database MySQL
export async function saveNotes(userId, noteData) {
  try {
    const response = await axios.post(`${API_URL}/notes`, {
      userId,
      ...noteData
    });
    return response.data;
  } catch (error) {
    console.error('Gagal menyimpan catatan ke database:', error);
    return { ok: false, message: 'Gagal sinkronisasi data ke cloud.' };
  }
}

// 7. Fungsi placeholder agar tidak memicu eror pemanggilan fungsi lama di komponen lain
export function initializeUserNotes(userId, initialData) {
  // Sistem database relational tidak lagi membutuhkan inisialisasi lokal mentah.
  return true;
}

export { createId };
