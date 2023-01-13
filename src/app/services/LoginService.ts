import { inject, injectable } from 'tsyringe';
import jwtConfig from '../../config/auth';
import { compare } from 'bcrypt';
import { User } from '../../entities/User';
import { NotFoundError, UnauthorizedError } from '../../helpers/api-errors';
import { IUsersRepository } from '../../interfaces/users';
import { Secret, sign } from 'jsonwebtoken';

interface CreateLoginDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
export class LoginService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
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

    const token = sign({}, jwtConfig.jwt.secret as Secret, {
      subject: user.id,
      expiresIn: jwtConfig.jwt.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
