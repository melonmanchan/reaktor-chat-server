export default {
    port: process.env.PORT             || 8000,
    jwt_secret: process.env.JWT_SECRET || 'shhhh',
    redis_url : process.env.REDIS_URL  || ''
};
