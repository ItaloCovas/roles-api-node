import { Role } from '../../entities/Role';

export interface CreateRoleDTO {
  name: string;
}

export interface UpdateRoleDTO {
  name: string;
  id: string;
}

export interface getByIdDTO {
  id: string;
}

export interface DeleteRoleDTO {
  id: string;
}

export interface IRolesRepository {
  create({ name }: CreateRoleDTO): Promise<Role>;
  update(role: Role): Promise<Role>;
  findAll({
    page,
    skip,
    take,
  }: PaginationParams): Promise<RolesPaginationProperties>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  delete(role: Role): Promise<void>;
}

export interface GetRolesServiceParams {
  page: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  skip: number;
  take: number;
}

export interface RolesPaginationProperties {
  perPage: number;
  total: number;
  currentPage: number;
  data: Array<Role>;
}
