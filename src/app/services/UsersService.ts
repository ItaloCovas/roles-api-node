import { inject, injectable } from 'tsyringe';
import { compare, hash } from 'bcrypt';
import { User } from '../../entities/User';
import { BadRequestError, NotFoundError } from '../../helpers/api-errors';
import { IRolesRepository } from '../../interfaces/Roles';
import {
  GetUsersServiceParams,
  IUsersRepository,
  UsersPaginationProperties,
} from '../../interfaces/Users';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  roleId: string;
}

interface ShowProfileParams {
  userId: string;
}

interface UpdateProfileDTO {
  userId: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
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

  async showProfileService({ userId }: ShowProfileParams): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return user;
  }

  async updateProfileService({
    userId,
    name,
    email,
    password,
    oldPassword,
  }: UpdateProfileDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const userEmail = await this.usersRepository.findByEmail(email);

    if (userEmail && userEmail.id !== userId) {
      throw new BadRequestError('Email already used.');
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);
      if (!checkOldPassword) {
        throw new BadRequestError('Old password must match.');
      }
      user.password = await hash(password, 10);
    }

    user.name = name;
    user.email = email;
    return this.usersRepository.update(user);
  }
}
