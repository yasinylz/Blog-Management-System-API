import { Request, Response } from 'express';
import { setCache } from '../utils/redisUtils';
declare module 'express' {
  export interface Request {
    cacheKey?: string; // Yeni özellik
  }
}

export const getExampleData = async (req: Request, res: Response): Promise<void> => {
  try {
    const exampleData = { id: 1, name: 'Redis Example' };

    if (req.cacheKey) {
      await setCache(req.cacheKey, exampleData);
    }

    res.status(200).json({
      fromCache: false,
      data: exampleData,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
