import { createClient } from 'redis';
import "dotenv/config";

const redisUrl = process.env.REDIS_URL || 'redis://localhost:3600';
export const redisClient = createClient({ url: redisUrl });
redisClient.on('error', (err) => { console.error('Error Redis: ', err); });
(async () => {
    try {
        await redisClient.connect();
        console.log('The connection to Redis is successful!');
    } catch (err) {
        console.error('Error when connecting to Redis: ', err);
    }
})();