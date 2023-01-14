import request from 'supertest';

import app from '../../src/app';

import DataResponse from '../../src/interfaces/DataResponse';
import { generateMockUser, isValidJWT } from '../helpers';
import { endpoints } from './constants';

describe('POST /api/v1/sign-up', () => {
  it('should fail if no user info provided', (done) => {
    request(app)
      .post(endpoints.signUp)
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

  it('should create an user if info is provided', (done) => {
    const userInfo = generateMockUser();

    request(app)
      .post(endpoints.signUp)
      .send(userInfo)
      .expect(201, done);
  });

  it('should not allow a single email to be in several accounts', async () => {
    const userInfo = generateMockUser();

    const response = await request(app)
      .post(endpoints.signUp)
      .set('Accept', 'application/json')
      .send(userInfo);

    expect(response.status).toEqual(201);
    expect(response.body.data.email).toEqual(userInfo.email);

    const response2 = await request(app)
      .post(endpoints.signUp)
      .set('Accept', 'application/json')
      .send(userInfo);

    expect(response2.status).toEqual(500);
    expect(response2.body.data).toBeNull();
    expect(response2.body.errors).toHaveLength(1);
  });

  it("should hash user's password", (done) => {
    const userInfo = generateMockUser();

    request(app)
      .post(endpoints.signUp)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(userInfo)
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const { data } = res.body as DataResponse;

        if (data.password === userInfo.password) {
          return done('Password should not be stored in plain text');
        }

        return done();
      });
  });

  it('should provide a valid JWT', (done) => {
    const userInfo = generateMockUser();

    request(app)
      .post(endpoints.signUp)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(userInfo)
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const {
          data: { token },
        } = res.body as DataResponse;

        if (typeof token !== 'string') {
          return done('Token should be provided to the user');
        }

        if (!isValidJWT(token)) {
          return done('Invalid token was provided');
        }

        return done();
      });
  });
});
