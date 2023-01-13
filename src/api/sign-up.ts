import express from 'express';

import DataResponse from '../interfaces/DataResponse';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const router = express.Router();

router.post<{}, DataResponse>('/', async (req, res, next) => {
  const response: DataResponse = { data: null, errors: [] };
  let { email, name, password } = req.body as Prisma.UserCreateInput;

  if (
    typeof email !== 'string' ||
    typeof name !== 'string' ||
    typeof password !== 'string'
  ) {
    response.errors.push({ message: 'Invalid user information has been provided' });
    return res.status(400).json(response);
  }

  // Hash password
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { email, name, password },
  }).catch( e => {
    console.error('Unexpected error creating user', e);

    response.errors.push({ message: 'Unexpected error creating user', stack: e });
    res.statusCode = 500;
    return null;
  });

  if (user === null) {
    return next(response.errors[0]);
  }
  // Create to be bearer token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.USER_TOKEN_EXPIRATION_TIME as string,
  });

  response.data = { ...user, token };

  return res.status(201).json(response);
});

export default router;
