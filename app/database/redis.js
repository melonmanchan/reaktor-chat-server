import { config } from '../config';
import redis from 'redis';
import bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = null;

function createRedisConnection() {
    return new Promise((resolve, reject) => {
        client = redis.createClient(config.redis_post, config.redis_host);

        client.on('ready', () => {
            resolve();
        });

        client.on('error', (err) => {
            reject(err);
        });
    });
}

export { client, createRedisConnection };
