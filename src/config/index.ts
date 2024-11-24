import dotenv from 'dotenv';

// Çevresel değişkenleri yükle
dotenv.config();

// TypeScript'te çevresel değişkenlerin türünü belirlemek
interface Config {
  MONGODB_URL: string;
  PORT: number;
  REDIS_PORT: number;
  REDIS_HOST: string;
  JWT_EXPIRE_IN:string;
  JWT_SECRETKEY:string;

}

// Çevresel değişkenlerin tipi kontrolü yapılırken, `process.env`'den gelen değerlerin her zaman string olduğunu unutmayın
const config: Config = {
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/blogdb', // MongoDB bağlantısı, varsayılan olarak localhost
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000, // Port numarasını `number` yap
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379, // Varsayılan Redis portu
  REDIS_HOST: process.env.REDIS_HOST || 'localhost', // Varsayılan Redis host
  JWT_SECRETKEY:process.env.JWT_SECRETKEY||"ookpkp",
  JWT_EXPIRE_IN:process.env.JWT_EXPIRE_IN ||'1h'

   
};

export default config;
