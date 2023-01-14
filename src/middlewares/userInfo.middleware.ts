import { NextFunction, Request, Response } from 'express';

import DataResponse from '../interfaces/DataResponse';
import { verifyToken } from './auth.middleware';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCurrentUserInfo = async (req: Request, res: Response<DataResponse>, next: NextFunction) => {

  // If user has been queried before, keep it and continue
  if (res.locals.user) {
    return next();
  }

  return verifyToken(req, res, async () => {
    const response: DataResponse = { data: null, errors: [] };


    // Current user id from decoded token
    const id = res.locals.decoded.id;

    const user = await prisma.user.findUnique(
      { where: { id } },
    ).catch( e => {
      console.error('Unexpected error retrieving user', e);

      response.errors.push({
        message: 'Unexpected error retrieving user',
        stack: e,
      });

      res.statusCode = 500;
      return null;
    });

    if (user === null) {
      if (res.statusCode === 500) {
        return next(response.errors[0]);
      }

      // User does not exist
      // This might only be possible if user is deleted from db
      //  and this token was still valid at the time
      response.errors.push({
        message: 'User not found',
      });

      return res.status(404).json(response);
    }

    res.locals.user = user;
    return next();
  });
};
