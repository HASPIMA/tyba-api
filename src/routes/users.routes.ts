import express, { Request } from 'express';
import axios from 'axios';

import DataResponse from '../interfaces/DataResponse';
import NearbySearchQuery from '../interfaces/NearbySeachQuery';
import { getCurrentUserInfo } from '../middlewares/userInfo.middleware';

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
  res.statusCode = 200;

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
      res.statusCode = error.status as number;
      response.errors.push(error.response?.data);

    } else {
      console.error('Unexpected error was thrown', error);

      res.statusCode = 500;
      response.errors.push({ message: 'Unexpected error was thrown' });
    }

    return null;
  });

  if (restaurants === null) {
    return res.json(response);
  }

  response.data = restaurants.data?.data;

  return res.json(response);
});

export default router;
