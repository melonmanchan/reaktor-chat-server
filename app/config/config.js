import os from 'os';

export default {
    port: process.env.PORT             || 8000,
    workers_count: process.env.WORKERS   || os.cpus().length - 1,
    jwt_secret: process.env.JWT_SECRET || 'shhhh',
    redis_host : process.env.REDIS_PORT_6379_TCP_ADDR  || 'localhost',
    redis_port : process.env.REDIS_PORT_6379_TCP_PORT  || '6379'
};
