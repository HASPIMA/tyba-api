import request from 'supertest';

import { type Express } from 'express';

import timersPromises from 'timers/promises';

import app from '../../src/app';
import { generateMockUser, jwtRegex } from '../helpers';
import { endpoints } from './constants';

const userInfo = generateMockUser();

beforeAll(async () => {
  // Create new user in db
  const signUp = await request(app)
    .post(endpoints.signUp)
    .send(userInfo)
    .expect(201);

  expect(signUp.body).toHaveProperty('data.token');
  expect(signUp.body.data.token).toMatch(jwtRegex);
});

// Update user token for each test
const login = async (_app: Express) => {
  await timersPromises.setTimeout(500, null);

  const loginRequest = await request(_app)
    .post(endpoints.login)
    .set('Accept', 'application/json')
    .send({ email: userInfo.email, password: userInfo.password })
    .expect(200);

  expect(loginRequest.body).toHaveProperty('data.token');
  expect(loginRequest.body.data.token).toMatch(jwtRegex);

  return loginRequest.body.data.token;
};

describe(`POST ${endpoints.logout}`, () => {
  it('should be sucessful when user is logged in', async () => {
    const token = await login(app);

    const logout = await request(app)
      .post(endpoints.logout)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    // Success status code
    expect(logout.statusCode).toBe(200);

    // No errors
    expect(logout.body).toHaveProperty('errors');
    expect(logout.body.errors).toHaveLength(0);
  });

  it('should fail to logout when token has been blacklisted', async () => {
    const token = await login(app);

    const logout1 = await request(app)
      .post(endpoints.logout)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    // No errors
    expect(logout1.body).toHaveProperty('errors');
    expect(logout1.body.errors).toHaveLength(0);

    const logout2 = await request(app)
      .post(endpoints.logout)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(logout2.statusCode).toBe(403);
  });

});
