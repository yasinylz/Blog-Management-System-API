import { Request, Response, NextFunction } from 'express';
import { getCache } from '../utils/redisUtils';

/**
 * Redis önbelleğini kontrol eden middleware
 * @param cacheKey Önbellekteki anahtar
 */
const redisCache = (cacheKey: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      res.status(200).json({
        fromCache: true,
        data: cachedData,
      });
      return;
    }

    req.cacheKey = cacheKey;
    next();
  } catch (err) {
    console.error('Redis Middleware Error:', err);
    next(); // Hata olsa bile işlem devam eder
  }
};

export default redisCache;
