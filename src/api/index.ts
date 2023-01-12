import express from 'express';

import DataResponse from '../interfaces/DataResponse';
import MessageResponse from '../interfaces/MessageResponse';

import { Prisma } from '@prisma/client';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.post<{}, DataResponse>('/sign-up', (req, res) => {
  const response: DataResponse = { data: null, errors: [] };
  const { email, name, password } = req.body as Prisma.UserCreateInput;

  if (
    typeof email !== 'string' ||
    typeof name !== 'string' ||
    typeof password !== 'string'
  ) {
    response.errors.push({ message: 'Invalid user information has been provided' });
    return res.status(400).json(response);
  }

  //TODO: Create user
});

export default router;
