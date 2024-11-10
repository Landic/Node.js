import { createClient } from 'redis';
import "dotenv/config";

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Error Redis: ', err));
(async () => { await redisClient.connect(); })();