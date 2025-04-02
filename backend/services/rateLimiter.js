const Redis = require('ioredis');
const redis = new Redis();

async function rateLimit(key, limit, duration) {
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, duration);
  }

  if (current > limit) {
    return false;
  }

  return true;
}

module.exports = { rateLimit };