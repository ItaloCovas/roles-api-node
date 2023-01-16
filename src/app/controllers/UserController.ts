import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';
import { UsersService } from '../services/UsersService';

export class UserController {
  async index(request: Request, response: Response): Promise<Response> {
    const usersService = container.resolve(UsersService);

    const page =
      request.query.page && Number(request.query.page) > 0
        ? Number(request.query.page)
        : 1;
    const limit =
      request.query.limit && Number(request.query.limit)
        ? Number(request.query.limit)
        : 15;

    const users = await usersService.getUsersService({ page, limit });

    return response.status(200).json(instanceToInstance(users));
  }

  async store(request: Request, response: Response): Promise<Response> {
    const usersService = container.resolve(UsersService);

    const { name, email, password, isAdmin, roleId } = request.body;

    const newUser = await usersService.createRoleService({
      name,
      email,
      password,
      isAdmin,
      roleId,
    });

    return response.status(201).json(instanceToInstance(newUser));
  }

  async getUserProfile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const usersService = container.resolve(UsersService);

    const userId = request.user.id;

    const user = await usersService.showProfileService({ userId });

    return response.status(200).json(instanceToInstance(user));
  }

  async updateUserProfile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const usersService = container.resolve(UsersService);

    const userId = request.user.id;

    const { name, email, password, oldPassword } = request.body;

    const updatedUser = await usersService.updateProfile({
      userId,
      name,
      email,
      password,
      oldPassword,
    });

    return response.status(201).json(instanceToInstance(updatedUser));
  }
}
