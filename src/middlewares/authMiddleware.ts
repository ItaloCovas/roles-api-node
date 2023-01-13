import { NextFunction, Request, Response } from 'express';
import { string } from 'joi';
import { Secret, verify } from 'jsonwebtoken';
import { UnauthorizedError } from '../helpers/api-errors';

interface JwtPayload {
  sub: string;
}

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('You are not allowed to perform this action.');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = verify(token, process.env.JWT_SECRET as Secret);
    const { sub } = decodedToken as JwtPayload;
    request.user = { id: sub };
    return next();
  } catch (err) {
    throw new UnauthorizedError('Invalid token.');
  }
};
