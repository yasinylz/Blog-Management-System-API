import express from 'express';
import { getExampleData } from '../controllers/exampleController';
import redisCache from '../middlewares/redisCache';

const router = express.Router();

// Örnek endpoint, Redis cache kontrolü yapar
router.get('/', redisCache('example:data'), getExampleData);

export default router;
