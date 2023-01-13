import express from 'express';

import DataResponse from '../interfaces/DataResponse';

import { PrismaClient, type User } from '@prisma/client';
const prisma = new PrismaClient();

const router = express.Router();

router.post<{}, DataResponse>('/', async (req, res, next) => {
  const response: DataResponse = { data: null, errors: [] };
  let { email, password } = req.body as User;

  if (typeof email !== 'string' || typeof password !== 'string') {
    response.errors.push({
      message: 'Invalid user information has been provided',
    });
    return res.status(400).json(response);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  }).catch( e => {
    console.error('Unexpected error retrieving user', e);

    response.errors.push({
      message: 'Unexpected error retrieving user',
      stack: e,
    });
    res.statusCode = 500;

    return null;
  });

  if (res.statusCode === 500) {
    return next(response.errors[0]);
  }

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
