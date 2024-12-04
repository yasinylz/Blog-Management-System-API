import { createClient } from 'redis';
import config from '../config';

const redisClient = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  password: config.REDIS_PASSWORD || undefined,
});

redisClient.on('connect', () => {
  console.log('Redis Connected...');
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

export default redisClient;
