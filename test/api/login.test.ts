import request from 'supertest';

import app from '../../src/app';
import { generateMockUser, jwtRegex } from '../helpers';

describe('POST /api/v1/login', () => {
  const endpointLogin = '/api/v1/login';

  it('should fail if no credentials are provided', (done) => {
    request(app)
      .post(endpointLogin)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        400,
        {
          data: null,
          errors: [{ message: 'Invalid user information has been provided' }],
        },
        done,
      );
  });

  it('should be able to login with recently created user', async () => {
    const userInfo = generateMockUser();

    // Create user in db
    const signUp = await request(app)
      .post('/api/v1/sign-up')
      .send(userInfo);

    expect(signUp.statusCode).toBe(201);
    expect(signUp.body).toHaveProperty('data.email');

    // Login with same credentials
    const login = await request(app)
      .post(endpointLogin)
      .set('Accept', 'application/json')
      .send({ email: userInfo.email, password: userInfo.password });

    expect(login.statusCode).toBe(200);

    // It has to be a valid JWT
    expect(login.body).toHaveProperty('data.token');
    expect(login.body.data.token).toMatch(jwtRegex);

    // Emails should match
    expect(login.body).toHaveProperty('data.email');
    expect(login.body).toBe(signUp.body.data.email);
  });
});
