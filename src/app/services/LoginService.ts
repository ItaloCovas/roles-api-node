import { inject, injectable } from 'tsyringe';
import jwtConfig from '../../config/auth';
import { compare } from 'bcrypt';
import { User } from '../../entities/User';
import { NotFoundError, UnauthorizedError } from '../../helpers/api-errors';
import { IUsersRepository } from '../../interfaces/Users';
import { Secret, sign } from 'jsonwebtoken';
import { IRefreshTokenRepository } from '../../interfaces/RefreshToken';

interface CreateLoginDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class LoginService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('RefreshTokenRepository')
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async createLoginService({
    email,
    password,
  }: CreateLoginDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Incorrect email/password.');
    }

    const passwordConfirm = await compare(password, user.password);

    if (!passwordConfirm) {
      throw new UnauthorizedError('Incorrect email/password.');
    }

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
