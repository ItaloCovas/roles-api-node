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

  // async getRole(request: Request, response: Response): Promise<Response> {
  //   const rolesService = container.resolve(RolesService);

  //   const { id } = request.params;

  //   const role = await rolesService.getRoleById({ id });

  //   return response.status(200).json(role);
  // }

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

  // async update(request: Request, response: Response) {
  //       const usersService = container.resolve(UsersService);

  //   const { id } = request.params;
  //   const { name } = request.body;

  //   const updatedRole = await rolesService.updateRoleService({ id, name });

  //   return response.status(201).json(updatedRole);
  // }

  // async delete(request: Request, response: Response) {
  //       const usersService = container.resolve(UsersService);

  //   const { id } = request.params;

  //   await rolesService.deleteRoleService({ id });

  //   return response.sendStatus(204);
  // }
}
