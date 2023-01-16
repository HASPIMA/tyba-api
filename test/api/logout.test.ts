import request from 'supertest';

import app from '../../src/app';
import { generateMockUser, jwtRegex } from '../helpers';
import { endpoints } from './constants';

const userInfo = generateMockUser();
let userToken: string;

beforeAll(async () => {
  // Create new user in db
  const signUp = await request(app)
    .post(endpoints.signUp)
    .send(userInfo)
    .expect(201);

  expect(signUp.body).toHaveProperty('data.token');
  expect(signUp.body.data.token).toMatch(jwtRegex);
});

describe(`POST ${endpoints.logout}`, () => {

  // Update user token for each test
  beforeEach(async () => {
    const login = await request(app)
      .post(endpoints.login)
      .set('Accept', 'application/json')
      .send({ email: userInfo.email, password: userInfo.password })
      .expect(200);

    expect(login.body).toHaveProperty('data.token');
    expect(login.body.data.token).toMatch(jwtRegex);

    userToken = login.body.data.token;
  });

  it('should be sucessful when user is logged in', async () => {
    const logout = await request(app)
      .post(endpoints.logout)
      .auth(userToken, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    // Success status code
    expect(logout.statusCode).toBe(200);

    // No errors
    expect(logout.body).toHaveProperty('errors');
    expect(logout.body.errors).toHaveLength(0);
  });

  it('should fail to logout when token has been blacklisted', async () => {
    const logout1 = await request(app)
      .post(endpoints.logout)
      .auth(userToken, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    // No errors
    expect(logout1.body).toHaveProperty('errors');
    expect(logout1.body.errors).toHaveLength(0);

    const logout2 = await request(app)
      .post(endpoints.logout)
      .auth(userToken, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(logout2.statusCode).toBe(403);
  });

});
