import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import { LoginService } from '../services/LoginService';

export class LoginController {
  async login(request: Request, response: Response): Promise<Response> {
    const loginService = container.resolve(LoginService);

    const { email, password } = request.body;

    const { user, accessToken, refreshToken } =
      await loginService.createLoginService({
        email,
        password,
      });

    return response
      .status(200)
      .json(instanceToInstance({ user, accessToken, refreshToken }));
  }
}
