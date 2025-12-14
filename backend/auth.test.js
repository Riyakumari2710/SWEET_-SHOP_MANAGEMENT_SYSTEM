const request = require('supertest');
const app = require('./app');

describe('Auth APIs', () => {

  const email = `test_${Date.now()}@test.com`;

  it('should register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email,
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
  });

  it('should login and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: '123456'
      });

    expect(res.body.token).toBeDefined();
  });

});
