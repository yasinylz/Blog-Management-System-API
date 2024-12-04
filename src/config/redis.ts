import { createClient } from 'redis';
import config from '../config';

const redisClient = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  
});

redisClient.on('connect', () => {
  console.log('Redis Connected...');
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

export default redisClient;
