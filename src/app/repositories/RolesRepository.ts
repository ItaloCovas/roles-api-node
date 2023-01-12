import { Role } from '../../entities/Role';
import {
  CreateRoleDTO,
  IRolesRepository,
  PaginationParams,
  RolesPaginationProperties,
} from '../../interfaces/roles/index';
import { dataSource } from '../../database';
import { Repository } from 'typeorm';

export class RolesRepository implements IRolesRepository {
  private repository: Repository<Role>;

  constructor() {
    this.repository = dataSource.getRepository(Role);
  }

  async findAll({
    page,
    skip,
    take,
  }: PaginationParams): Promise<RolesPaginationProperties> {
    const [roles, count] = await this.repository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      perPage: take,
      total: count,
      currentPage: page,
      data: roles,
    };

    return result;
  }

  async create({ name }: CreateRoleDTO): Promise<Role> {
    const role = this.repository.create({ name });

    return this.repository.save(role);
  }

  async update(role: Role): Promise<Role> {
    return await this.repository.save(role);
  }

  async delete(role: Role): Promise<void> {
    await this.repository.remove(role);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOneBy({ name });
  }

  async findById(id: string): Promise<Role | null> {
    return this.repository.findOneBy({ id });
  }
}

export const rolesRepository = new RolesRepository();
