import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
const redis_host = process.env.REDIS_HOST;
const redis_port = process.env.REDIS_PORT;
const redis_password = process.env.REDIS_PASSWORD;

const redisClient = createClient({
  password: redis_password,
  socket: {
    host: redis_host,
    port: redis_port,
  },
});

redisClient.on('error', (err) =>
  console.error(`Redis Error: ${err}`, redis_host)
);
redisClient.on('connect', () => console.info('Redis connected', redis_host));
redisClient.on('reconnecting', () => console.info('Redis reconnecting'));
redisClient.on('ready', () => {
  console.info('Redis ready!');
});
redisClient.on('end', () => {
  console.info('Client disconnected from Redis');
});
process.on('SIGINT', () => {
  redisClient.quit();
});

await redisClient.connect();

export default redisClient;
