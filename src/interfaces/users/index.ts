import { Role } from '../../entities/Role';
import { User } from '../../entities/User';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  role: Role;
}

export interface PaginationParams {
  page: number;
  skip: number;
  take: number;
}

export interface GetUsersServiceParams {
  page: number;
  limit: number;
}

export interface UsersPaginationProperties {
  perPage: number;
  total: number;
  currentPage: number;
  data: Array<User>;
}

export interface IUsersRepository {
  create({
    name,
    email,
    password,
    isAdmin,
    role,
  }: CreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  findAll({
    page,
    skip,
    take,
  }: PaginationParams): Promise<UsersPaginationProperties>;
  findById(id: string): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(user: User): Promise<void>;
}
