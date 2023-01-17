import express, { Request } from 'express';
import axios from 'axios';

import DataResponse from '../interfaces/DataResponse';
import NearbySearchQuery from '../interfaces/NearbySeachQuery';
import { getCurrentUserInfo } from '../middlewares/userInfo.middleware';

import { type User } from '@prisma/client';
import { type JwtPayload } from 'jsonwebtoken';
import { type Redis } from 'ioredis';

const router = express.Router();

// All routes refering to /**/users/* require getCurrentUserInfo middleware
router.route('/*').all(getCurrentUserInfo);
router
  .route('/nearby_search')
  .get<Request, DataResponse, unknown, NearbySearchQuery>(async (req, res) => {
  const response: DataResponse = {
    data: null,
    errors: [],
  };

  const query = req.query;

  if (typeof query.latLong !== 'string') {
    response.errors.push({
      message: 'No query was provided or missing field',
    });

    return res.status(400).json(response);
  }

  // We don't need user information at this point so we ignore it

  // Assume endpoint will work
  let statusCode = 200;

  // Call trip advisor's API
  const apiEndpoint = 'https://api.content.tripadvisor.com/api/v1/location/nearby_search';
  const restaurants = await axios.get(apiEndpoint, {
    params: {
      ...query,
      key: process.env.TRIPADVISOR_API_KEY,
      category: 'restaurants',
    },
  }).catch( error => {
    if (axios.isAxiosError(error)) {
      statusCode = error.status || 400;
      response.errors.push(error.response?.data?.error);

    } else {
      console.error('Unexpected error was thrown', error);

      statusCode = 500;
      response.errors.push({ message: 'Unexpected error was thrown' });
    }

    return null;
  });

  if (restaurants === null) {
    return res.status(statusCode).json(response);
  }

  response.data = restaurants.data?.data;

  return res.status(statusCode).json(response);
});

router
  .route('/logout')
  .post<Request, DataResponse>(async (_req, res) => {
  const response: DataResponse = { data: null, errors: [] };
  let statusCode = 200;

  const user = res.locals.user as User;
  const token = res.locals.bearerToken as string;
  const decodedToken = res.locals.decoded as JwtPayload;

  const redisClient = res.locals.redisClient as Redis;

  try {
    // Add token to the blacklist for as long as the token is valid
    //  This prevents invalid tokens to be used and only check for the ones
    //  that are not expired
    const blackList = await redisClient.set(token, user.id, 'EXAT', decodedToken.exp as number);

    if (blackList !== 'OK') {
      statusCode = 500;
      response.errors.push({ message: 'Could not logout' });
    }
  } catch (error) {
    console.error({ error });

    statusCode = 500;
    response.errors.push({ message: 'Unexpected error happened' });
  }

  if (statusCode === 200) {
    response.data = 'User logged out';
  }

  return res.status(statusCode).json(response);
});
export default router;
