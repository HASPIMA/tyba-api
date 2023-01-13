import request from 'supertest';

import app from '../src/app';

import { faker } from '@faker-js/faker';

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏',
      }, done);
  });
});

describe('POST /api/v1/sign-up', () => {
  it('should fail if no user info provided', (done) => {
    request(app)
      .post('/api/v1/sign-up')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {
        data: null,
        errors: [{ message: 'Invalid user information has been provided' }],
      }, done);
  });

  it('should create an user if info is provided', (done) => {
    const userInfo = { email: faker.internet.email(),
      name: faker.name.fullName(),
      password: faker.internet.password(),
    };

    request(app)
      .post('/api/v1/sign-up')
      .send(userInfo)
      .expect(201, done);
  });
});

