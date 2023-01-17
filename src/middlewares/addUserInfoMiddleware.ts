import { NextFunction, Request, Response } from 'express';
import { decode, Secret, verify } from 'jsonwebtoken';
import { UnauthorizedError } from '../helpers/api-errors';

interface JwtPayload {
  sub: string;
}

export const addUserInfoMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      error: true,
      code: 'token.invalid',
      message: 'Access token is invalid.',
    });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return response.status(401).json({
      error: true,
      code: 'token.invalid',
      message: 'Access token is invalid.',
    });
  }

  try {
    const decodedToken = decode(token);
    const { sub } = decodedToken as JwtPayload;
    request.user = { id: sub };
    return next();
  } catch (err) {
    return response.status(401).json({
      error: true,
      code: 'token.invalid',
      message: 'Access token is invalid.',
    });
  }
};
