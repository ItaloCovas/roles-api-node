import { inject, injectable } from 'tsyringe';
import { Role } from '../../entities/Role';
import { BadRequestError, NotFoundError } from '../../helpers/api-errors';
import {
  CreateRoleDTO,
  DeleteRoleDTO,
  getByIdDTO,
  GetRolesServiceParams,
  IRolesRepository,
  RolesPaginationProperties,
  UpdateRoleDTO,
} from '../../interfaces/Roles';

@injectable()
export class RolesService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  async getRolesService({
    page,
    limit,
  }: GetRolesServiceParams): Promise<RolesPaginationProperties> {
    const take = limit;
    const skip = Number((page - 1) * take);
    return this.rolesRepository.findAll({ page, skip, take });
  }

  async getRoleById({ id }: getByIdDTO): Promise<Role | null> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    return role;
  }

  async createRoleService({ name }: CreateRoleDTO): Promise<Role> {
    const roleExists = await this.rolesRepository.findByName(name);

    if (roleExists) {
      throw new BadRequestError('Role already exists.');
    }

    return this.rolesRepository.create({ name });
  }

  async updateRoleService({ name, id }: UpdateRoleDTO): Promise<Role | null> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    const roleExists = await this.rolesRepository.findByName(name);

    if (roleExists && role.name !== roleExists.name) {
      throw new BadRequestError('Role already exists.');
    }

    role.name = name;

    const updatedRole = await this.rolesRepository.update(role);

    return updatedRole;
  }

  async deleteRoleService({ id }: DeleteRoleDTO) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    this.rolesRepository.delete(role);
  }
}
