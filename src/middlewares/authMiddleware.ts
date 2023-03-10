import { NextFunction, Request, Response } from 'express';
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
    const decodedToken = verify(token, process.env.JWT_SECRET as Secret);
    const { sub } = decodedToken as JwtPayload;
    request.user = { id: sub };
    return next();
  } catch (err) {
    return response.status(401).json({
      error: true,
      code: 'token.expired',
      message: 'Access token is expired.',
    });
  }
};
