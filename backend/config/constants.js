module.exports = {
  ROLES: {
    VISITOR: 'visitor',
    REGULAR: 'regular',
    PREMIUM: 'premium',
    SUPER_ADMIN: 'super_admin',
  },
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  SALT_ROUNDS: 12,
  SOCIAL_LOGIN_KEYS: {
    GOOGLE: process.env.GOOGLE_API_KEY || '',
    FACEBOOK: process.env.FACEBOOK_API_KEY || '',
  },
};