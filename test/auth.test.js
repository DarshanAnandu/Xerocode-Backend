// test/auth.test.js
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app'); // Your Express app
const setupTestEnvironment = require('./test-setup');

describe('Authentication', () => {
  before(async () => {
    await setupTestEnvironment();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'tes3@example.com',
        password: 'test123',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('accessToken');
    expect(response.body).to.have.property('refreshToken');
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'tes3@example.com',
        password: 'test123',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('accessToken');
    expect(response.body).to.have.property('refreshToken');
  });
});
