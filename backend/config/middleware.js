const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redis = new Redis();
const { ROLES, JWT_SECRET } = require('./constants');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = new Redis();

// Rate limiting middleware
const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Middleware for JWT authentication
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Middleware for Role-Based Access Control (RBAC)
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = { limiter, authenticateJWT, authorizeRoles };