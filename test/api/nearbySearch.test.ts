import request from 'supertest';

import app from '../../src/app';
import { endpoints } from './constants';

describe(`GET ${endpoints.nearbySearch}`, () => {
  it('should require a user to be logged in', (done) => {
    request(app)
      .get(endpoints.nearbySearch)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});
