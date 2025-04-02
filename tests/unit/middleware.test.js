jest.mock('rate-limit-redis', () => {
  return jest.fn().mockImplementation(() => ({
    incr: jest.fn((key, cb) => cb(null, 1)),
    decrement: jest.fn(),
    resetKey: jest.fn()
  }));
});

const { authenticateJWT, authorizeRoles } = require('../../backend/config/middleware');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

jest.mock('jsonwebtoken');
jest.mock('ioredis');

describe('Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      ip: '127.0.0.1',
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('JWT Authentication', () => {
    it('should reject requests without token', async () => {
      await authenticateJWT(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should reject invalid tokens', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      await authenticateJWT(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });

    it('should accept valid tokens', async () => {
      req.headers.authorization = 'Bearer validtoken';
      const mockUser = { id: 1, role: 'admin' };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockUser);
      });

      await authenticateJWT(req, res, next);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Role Authorization', () => {
    it('should allow access for permitted roles', () => {
      req.user = { role: 'admin' };
      const middleware = authorizeRoles('admin', 'moderator');
      
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should deny access for unauthorized roles', () => {
      req.user = { role: 'user' };
      const middleware = authorizeRoles('admin', 'moderator');
      
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });
  });

  // Note: Rate limiter tests would require more complex Redis mocking
  // and are often better tested via integration tests
});