import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import Routers from './routes/index';
import config from './config';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import logger from './config/logger';
import redisClient from './config/redis';
const app = express();
redisClient.connect();
// JSON verilerini almak için middleware
app.use(express.json());
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);
// MongoDB bağlantısı
mongoose.connect(config.MONGODB_URL)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Statik dosyaları sunmak için
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API rotalarını kullanmaya başla
app.use('/api', Routers);
app.use(globalErrorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
