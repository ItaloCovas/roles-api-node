import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import { User } from '../../entities/User';
import { BadRequestError, NotFoundError } from '../../helpers/api-errors';
import { IRolesRepository } from '../../interfaces/roles';
import {
  GetUsersServiceParams,
  IUsersRepository,
  UsersPaginationProperties,
} from '../../interfaces/users';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  roleId: string;
}

@injectable()
export class UsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
  ) {}

  async getUsersService({
    page,
    limit,
  }: GetUsersServiceParams): Promise<UsersPaginationProperties> {
    const take = limit;
    const skip = Number((page - 1) * take);
    return this.usersRepository.findAll({ page, skip, take });
  }

  // async getRoleById({ id }: getByIdDTO): Promise<Role | null> {
  //   const role = await this.rolesRepository.findById(id);

  //   if (!role) {
  //     throw new NotFoundError('Role not found.');
  //   }

  //   return role;
  // }

  async createRoleService({
    name,
    email,
    password,
    isAdmin,
    roleId,
  }: CreateUserDTO): Promise<User> {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      throw new BadRequestError('Email address already used.');
    }

    const role = await this.rolesRepository.findById(roleId);

    if (!role) {
      throw new NotFoundError('Role not found.');
    }

    const passwordHash = await hash(password, 10);
    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      isAdmin,
      role,
    });

    return user;
  }

  // async updateRoleService({ name, id }: UpdateRoleDTO): Promise<Role | null> {
  //   const role = await this.rolesRepository.findById(id);

  //   if (!role) {
  //     throw new NotFoundError('Role not found.');
  //   }

  //   const roleExists = await this.rolesRepository.findByName(name);

  //   if (roleExists && role.name !== roleExists.name) {
  //     throw new BadRequestError('Role already exists.');
  //   }

  //   role.name = name;

  //   const updatedRole = await this.rolesRepository.update(role);

  //   return updatedRole;
  // }

  // async deleteRoleService({ id }: DeleteRoleDTO) {
  //   const role = await this.rolesRepository.findById(id);

  //   if (!role) {
  //     throw new NotFoundError('Role not found.');
  //   }

  //   this.rolesRepository.delete(role);
  // }
}
