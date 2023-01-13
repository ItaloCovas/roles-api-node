import { Repository } from 'typeorm';
import { dataSource } from '../../database';
import { User } from '../../entities/User';
import {
  CreateUserDTO,
  IUsersRepository,
  PaginationParams,
  UsersPaginationProperties,
} from '../../interfaces/users';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  async findAll({
    page,
    skip,
    take,
  }: PaginationParams): Promise<UsersPaginationProperties> {
    const [users, count] = await this.repository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      perPage: take,
      total: count,
      currentPage: page,
      data: users,
    };

    return result;
  }

  async create({
    name,
    email,
    password,
    isAdmin,
    role,
  }: CreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      password,
      isAdmin,
      role,
    });

    return this.repository.save(user);
  }

  async update(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async delete(user: User): Promise<void> {
    await this.repository.remove(user);
  }

  async findByName(name: string): Promise<User | null> {
    return this.repository.findOneBy({ name });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }
}
