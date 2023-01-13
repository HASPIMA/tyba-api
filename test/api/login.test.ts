import request from 'supertest';

import app from '../../src/app';

describe('POST /api/v1/login', () => {
  it('should fail if no credentials are provided', (done) => {
    request(app)
      .post('/api/v1/login')
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
});
