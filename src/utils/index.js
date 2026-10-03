const getInitialData = () => ([
  {
    id: 'sample-1',
    title: 'Ringkasan React Fundamental',
    body: 'React membantu kita membangun antarmuka berbasis komponen. Komponen dapat digunakan kembali sehingga struktur aplikasi lebih terorganisir.',
    category: 'Materi Kuliah',
    createdAt: '2026-09-28T08:30:00.000Z',
    updatedAt: '2026-09-28T08:30:00.000Z',
    archived: false,
    pinned: true,
  },
  {
    id: 'sample-2',
    title: 'Checklist Tugas Front-End',
    body: 'Selesaikan halaman utama, cek validasi form, rapikan responsive layout, lalu lakukan pengujian sebelum submission.',
    category: 'Tugas',
    createdAt: '2026-09-30T10:15:00.000Z',
    updatedAt: '2026-09-30T10:15:00.000Z',
    archived: false,
    pinned: false,
  },
  {
    id: 'sample-3',
    title: 'Ide Pengembangan Project',
    body: 'Tambahkan login dan register, kategori catatan, pencarian, filter, edit catatan, arsip, serta penyimpanan data lokal.',
    category: 'Ide',
    createdAt: '2026-10-01T13:10:00.000Z',
    updatedAt: '2026-10-01T13:10:00.000Z',
    archived: false,
    pinned: false,
  },
]);

const showFormattedDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('id-ID', options);
};

const showShortDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export { getInitialData, showFormattedDate, showShortDate };
