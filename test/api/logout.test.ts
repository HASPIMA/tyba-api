import request from 'supertest';

import app, { redisClient } from '../../src/app';
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

describe(`POST ${endpoints.logout}`, () => {

  it('should have a connection to redis', async () => {
    const ping = await redisClient.PING();

    expect(ping).toBe('PONG');
  });

});
