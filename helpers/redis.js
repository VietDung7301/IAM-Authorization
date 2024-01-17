const { createClient } = require('redis');
const client = createClient({
    url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', err => console.log('Redis client Error', err));
client.connect();

module.exports = { client }