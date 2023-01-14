import request from 'supertest';

import app from '../../src/app';
import { generateMockUser } from '../helpers';
import { endpoints } from './constants';

let token: string;

beforeAll(async () => {
  const userInfo = generateMockUser();

  // Create new user in db
  const signUp = await request(app)
    .post(endpoints.signUp)
    .send(userInfo)
    .expect(201);

  expect(signUp.body).toHaveProperty('data.token');
  expect(signUp.body.data.token).not.toBeNull();

  token = signUp.body.data.token;
});

describe(`GET ${endpoints.nearbySearch}`, () => {
  it('should require a jwt to be provided', (done) => {
    request(app)
      .get(endpoints.nearbySearch)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should fail if no query is given', async () => {
    // Try to get some restaurants
    const nearbyRestaurants = await request(app)
      .get(endpoints.nearbySearch)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    const resBody = nearbyRestaurants.body;

    expect(resBody).toHaveProperty('data');
    expect(resBody.data).toBeNull();

    expect(resBody).toHaveProperty('errors');
    expect(resBody.errors).toHaveLength(1);

    expect(nearbyRestaurants.statusCode).toBe(400);

  });
});
