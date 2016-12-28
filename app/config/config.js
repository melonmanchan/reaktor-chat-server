import os from 'os';

export default {
    port: process.env.PORT             || 8000,
    processes: process.env.PROCESSES   || os.cpus().length,
    jwt_secret: process.env.JWT_SECRET || 'shhhh',
    redis_url : process.env.REDIS_URL  || ''
};
