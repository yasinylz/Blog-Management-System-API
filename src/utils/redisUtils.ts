import redisClient from '../config/redis';
import config from '../config';

/**
 * Redis'e veri kaydet
 * @param key Anahtar
 * @param value Değer
 * @param expiration Süresi (saniye cinsinden, opsiyonel)
 */
export const setCache = async (key: string, value: unknown, expiration: number = config.CACHE_EXPIRATION): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: expiration });
    console.log(`Cache set: ${key}`);
  } catch (err) {
    console.error('Redis setCache Error:', err);
  }
};

/**
 * Redis'ten veri al
 * @param key Anahtar
 * @returns Değer veya null
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis getCache Error:', err);
    return null;
  }
};

/**
 * Redis'ten bir anahtar sil
 * @param key Anahtar
 */
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
    console.log(`Cache deleted: ${key}`);
  } catch (err) {
    console.error('Redis deleteCache Error:', err);
  }
};
