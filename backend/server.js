const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
// Menggunakan port 3000 sesuai dengan pengaturan di file .env Anda
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Jalur Endpoint API untuk diakses oleh Axios dari Frontend
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('REST API StudyDesk Server Berhasil Menyala!');
});

app.listen(PORT, () => {
  console.log(`Server Express berjalan lancar di port ${PORT}`);
});
