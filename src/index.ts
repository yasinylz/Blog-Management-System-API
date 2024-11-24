import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Routers from './routes/index';
import config from './config';

const app = express();

// JSON verilerini almak için middleware
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(config.MONGODB_URL)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Statik dosyaları sunmak için
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API rotalarını kullanmaya başla
app.use('/api', Routers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
