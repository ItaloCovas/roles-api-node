import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RolesService } from '../services/RolesService';

export class RolesController {
  async index(request: Request, response: Response): Promise<Response> {
    const rolesService = container.resolve(RolesService);
    const page =
      request.query.page && Number(request.query.page) > 0
        ? Number(request.query.page)
        : 1;
    const limit =
      request.query.limit && Number(request.query.limit)
        ? Number(request.query.limit)
        : 15;

    const roles = await rolesService.getRolesService({ page, limit });

    return response.status(200).json(roles);
  }

  async getRole(request: Request, response: Response): Promise<Response> {
    const rolesService = container.resolve(RolesService);

    const { id } = request.params;

    const role = await rolesService.getRoleById({ id });

    return response.status(200).json(role);
  }

  async store(request: Request, response: Response): Promise<Response> {
    const rolesService = container.resolve(RolesService);

    const { name } = request.body;

    const newRole = await rolesService.createRoleService({ name });

    return response.status(201).json(newRole);
  }

  async update(request: Request, response: Response) {
    const rolesService = container.resolve(RolesService);

    const { id } = request.params;
    const { name } = request.body;

    const updatedRole = await rolesService.updateRoleService({ id, name });

    return response.status(201).json(updatedRole);
  }

  async delete(request: Request, response: Response) {
    const rolesService = container.resolve(RolesService);

    const { id } = request.params;

    await rolesService.deleteRoleService({ id });

    return response.sendStatus(204);
  }
}
