import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import DataResponse from '../interfaces/DataResponse';

const verifyToken = (req: Request, res: Response<DataResponse>, next: NextFunction) => {
  const token = req.headers.authorization;

  const response: DataResponse = {
    data: null,
    errors: [],
  };

  if (!token || typeof token !== 'string') {
    response.errors.push({ message: 'No token provided' });
    return res.status(401).json(response);
  }
  try {
    // Decode JWT and store it over `res.locals.decoded`
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.decoded = decoded;

    // TODO: Verify token is not blacklisted

    next();
  } catch (err) {
    response.errors.push({ message: 'Invalid token', stack: err as any });

    return next(response.errors[0]);
  }
};
