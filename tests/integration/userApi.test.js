process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const sequelize = require('../../backend/config/database');
const User = require('../../backend/models/User');
const app = require('../../backend/app');

// Mock nodemailer since we don't need real emails in tests
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true)
  })
}));

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(true)
  }));
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Initialize models after sync
  User.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    if (response.statusCode !== 201) {
      console.error('Register Error Response:', response.body);
    }
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('userId');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    if (response.statusCode !== 400) {
      console.error('Duplicate Email Error Response:', response.body);
    }
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should login a registered user', async () => {
    const testUser = {
      email: 'loginuser@example.com',
      password: 'TestPassword123!'
    };

    // Register user
    const registerResponse = await request(app)
      .post('/api/users/register')
      .send(testUser);
    
    if (registerResponse.statusCode !== 201) {
      console.error('Register failed:', registerResponse.body);
    }

    // Verify user was created
    const dbUser = await User.findOne({ where: { email: testUser.email } });
    if (!dbUser) {
      console.error('User not found in database after registration');
    } else {
      console.log('Stored user password hash:', dbUser.password);
    }

    // Attempt login
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send(testUser);

    if (loginResponse.statusCode !== 200) {
      console.error('Login failed:', {
        status: loginResponse.statusCode,
        body: loginResponse.body,
        dbUser: dbUser ? dbUser.get({ plain: true }) : null
      });
    }

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    // Cleanup
    if (dbUser) {
      await dbUser.destroy();
    }
  });

  it('should not login with invalid credentials', async () => {
    // Register a user first
    await request(app)
      .post('/api/users/register')
      .send({
        email: 'invaliduser@example.com',
        password: 'password123',
      });

    // Attempt to log in with incorrect password
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'invaliduser@example.com',
        password: 'wrongpassword',
      });

    expect(loginResponse.statusCode).toBe(401);
  });

  it('should not login a non-existing user', async () => {
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexisting@example.com',
        password: 'password123',
      });
    expect(loginResponse.statusCode).toBe(404);
  });
});