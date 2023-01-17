import { inject, injectable } from 'tsyringe';
import jwtConfig from '../../config/auth';
import { User } from '../../entities/User';
import { NotFoundError, UnauthorizedError } from '../../helpers/api-errors';
import { IUsersRepository } from '../../interfaces/Users';
import { IRefreshTokenRepository } from '../../interfaces/RefreshToken';
import { Secret, sign } from 'jsonwebtoken';

interface CreateAccessAndRefreshTokenDTO {
  userId: string;
  refresh_token: string;
}

interface IResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class RefreshTokenService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('RefreshTokenRepository')
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async createRefreshTokenService({
    userId,
    refresh_token,
  }: CreateAccessAndRefreshTokenDTO): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const refreshTokenExists = await this.refreshTokenRepository.findByToken(
      refresh_token,
    );

    if (!user) {
      throw new UnauthorizedError('Refresh token not found.');
    }

    const dateNow = new Date().getTime();

    if (
      !refreshTokenExists?.isValid ||
      refreshTokenExists.expires.getTime() < dateNow
    ) {
      throw new UnauthorizedError('Refresh is invalid/expired.');
    }

    await this.refreshTokenRepository.invalidate(refreshTokenExists);

    // Creating new refresh and access tokens

    const accessToken = sign({}, jwtConfig.jwt.secret as Secret, {
      subject: user.id,
      expiresIn: jwtConfig.jwt.expiresIn,
    });

    const expires = new Date(Date.now() + jwtConfig.refreshToken.duration);

    const refreshToken = sign({}, jwtConfig.refreshToken.secret as Secret, {
      subject: user.id,
      expiresIn: jwtConfig.refreshToken.expiresIn,
    });

    await this.refreshTokenRepository.create({
      token: refreshToken,
      expires,
      userId: user.id,
      isValid: true,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
