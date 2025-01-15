import { createClient } from 'redis';
import 'dotenv/config';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const cacheClient = createClient({ url: redisUrl });

cacheClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

(async () => {
    try {
        await cacheClient.connect();
        console.log('Successfully connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();