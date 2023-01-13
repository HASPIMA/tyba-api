import express from 'express';

import DataResponse from '../interfaces/DataResponse';
import ErrorResponse from '../interfaces/ErrorResponse';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { PrismaClient, type User } from '@prisma/client';
import { exclude } from '../helpers/exclude';
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

  // We do not reveal which of these two is incorrect to
  //  prevent information leakage
  const badCredentials: ErrorResponse = {
    message: 'Check your email or password',
  };


  if (user === null) {
    response.errors.push(badCredentials);
    return res.status(401).json(response);
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    response.errors.push(badCredentials);
    return res.status(401).json(response);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.USER_TOKEN_EXPIRATION_TIME as string,
  });

  const userWithoutPassword = exclude(user, ['password']);

  response.data = { ...userWithoutPassword, token };

  return res.status(200).json(response);
});

export default router;
