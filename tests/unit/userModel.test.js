process.env.JWT_SECRET = 'test-secret';
const sequelize = require('../../backend/config/database');
const User = require('../../backend/models/User');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Initialize model after sync
  User.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Model', () => {
  it('should create a user with valid attributes', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'REGULAR',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('REGULAR');
  });

  it('should not create a user with invalid email', async () => {
    await expect(
      User.create({
        email: 'invalid-email',
        password: 'password123',
        role: 'REGULAR',
      })
    ).rejects.toThrow();
  });
});