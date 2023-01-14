import express, { Request } from 'express';

import DataResponse from '../interfaces/DataResponse';
import NearbySearchQuery from '../interfaces/NearbySeachQuery';
import { getCurrentUserInfo } from '../middlewares/userInfo.middleware';

const router = express.Router();

// All routes refering to /**/users/* require getCurrentUserInfo middleware
router.route('/*').all(getCurrentUserInfo);
router.route('/nearby_search').get<Request, DataResponse, unknown, NearbySearchQuery>(async (req, res) => {
  const response: DataResponse = {
    data: null,
    errors: [],
  };

  const query = req.query;

  if (typeof query.latLong !== 'string') {
    response.errors.push({ message: 'No query was provided or missing field' });

    return res.status(400).json(response);
  }

  // We don't need user information at this point so we ignore it

  //TODO: Call trip advisor's API

  return res.status(500).json(response);
});

export default router;
