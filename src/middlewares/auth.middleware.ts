import { NextFunction, Request, Response } from 'express';

import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import DataResponse from '../interfaces/DataResponse';

export const verifyToken = (req: Request, res: Response<DataResponse>, next: NextFunction) => {
  const regex = /^Bearer (.+)$/;
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

    const match = regex.exec(token);

    if (match === null) {
      throw new JsonWebTokenError('Invalid Bearer token');
    }

    const bearer = match[1];
    res.locals.bearerToken = bearer;

    // Decode JWT and store it over `res.locals.decoded`
    const decoded = jwt.verify( bearer, process.env.JWT_SECRET as string);
    res.locals.decoded = decoded;

    // TODO: Verify token is not blacklisted

    next();
  } catch (err) {
    console.log('Invalid token:', token);
    console.error(err);
    response.errors.push({ message: `Invalid token: ${token}` });

    return res.status(401).json(response);
  }
};
