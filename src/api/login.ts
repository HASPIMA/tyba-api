import express from 'express';

import DataResponse from '../interfaces/DataResponse';

import { type User } from '@prisma/client';

const router = express.Router();

router.post<{}, DataResponse>('/', async (req, res) => {
  const response: DataResponse = { data: null, errors: [] };
  let { email,  password } = req.body as User;

  if (
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    response.errors.push({ message: 'Invalid user information has been provided' });
    return res.status(400).json(response);
  }

  return res.status(500).json(response);
});

export default router;
