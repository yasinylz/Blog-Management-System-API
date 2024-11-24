import redis from 'redis';
import config from '../config'

const redisClient = redis.createClient({
    url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT || 6376}`,
  });

redisClient.on('connect',()=>{
    console.log('Redis Connected...');
})
export default redisClient;