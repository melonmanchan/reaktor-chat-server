import { config }          from '../config';
import { createRedisSub } from './redis-sub';
import { createRedisPub } from './redis-pub';

import redis from 'redis';
import Promise from 'bluebird'

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

let client = null;

function createRedisConnection() {
    return new Promise((resolve, reject) => {
        client = redis.createClient({ port: config.redis_port, host: config.redis_host });

        client.on('ready', () => {
            resolve();
        });

        client.on('error', (err) => {
            reject(err);
        });

        createRedisSub(client);
        createRedisPub(client);
    });
}

export { client, createRedisConnection };
