import dotenv from 'dotenv';

// Çevresel değişkenleri yükle
dotenv.config();

// TypeScript'te çevresel değişkenlerin türünü belirlemek
interface Config {
  MONGODB_URL: string;
  PORT: number;
  REDIS_PORT: number;
  REDIS_HOST: string;
  JWT_EXPIRE_IN: string;
  JWT_SECRETKEY: string;
  REDIS_PASSWORD: string; // Şifre string olarak belirlenmeli
  CACHE_EXPIRATION:number
}


const config: Config = {
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/blogdb',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  JWT_SECRETKEY: process.env.JWT_SECRETKEY || 'ookpkp',
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN || '1h',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '123456',
  CACHE_EXPIRATION: 3600, // Varsayılan önbellek süresi (saniye cinsinden)
};


export default config;
