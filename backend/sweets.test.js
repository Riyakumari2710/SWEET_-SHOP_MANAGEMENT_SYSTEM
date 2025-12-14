const request = require('supertest');
const app = require('./app');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'ritik@test.com',
      password: '123456'
    });

  token = res.body.token;
});

describe('Sweets APIs', () => {

  it('should get sweets list', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});
