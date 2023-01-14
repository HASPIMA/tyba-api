import express, { Request } from 'express';

import DataResponse from '../interfaces/DataResponse';
import { getCurrentUserInfo } from '../middlewares/userInfo.middleware';

const router = express.Router();

// All routes refering to /**/users/* require getCurrentUserInfo middleware
router.route('/*').all(getCurrentUserInfo);
router.route('/nearby_search').get<Request, DataResponse>(async (req, res) => {
  const response: DataResponse = {
    data: null,
    errors: [],
  };

  // We don't need user information at this point so we ignore it

  //TODO: Call trip advisor's API

  response.errors.push({ message: 'No query was provided' });

  return res.status(400).json(response);
});

export default router;
