import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RefreshTokenService } from '../services/RefreshTokenService';

export class RefreshTokenController {
  async create(request: Request, response: Response): Promise<Response> {
    const refreshTokenService = container.resolve(RefreshTokenService);

    const userId = request.user.id;
    const { refresh_token } = request.body;

    const { user, accessToken, refreshToken } =
      await refreshTokenService.createRefreshTokenService({
        userId,
        refresh_token,
      });

    return response
      .status(201)
      .json(instanceToInstance({ user, accessToken, refreshToken }));
  }
}
