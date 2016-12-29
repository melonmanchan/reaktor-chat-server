import { config }          from '../config';
import { createChatSub } from './redis-sub';
import { createChatPub } from './redis-pub';

import redis from 'redis';
import bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

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

        createChatSub(client);
        createChatPub(client);
    });
}

export { client, createRedisConnection };
