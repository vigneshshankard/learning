const request = require('supertest');
const app = require('../../backend/app'); // Assuming app.js initializes the Express app

describe('User API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('john.doe@example.com');
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

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });
});