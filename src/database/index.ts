import { DataSource } from 'typeorm';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { CreateRoles1673265903547 } from '../typeorm/migrations/1673265903547-CreateRoles';
import { CreateUsers1673535312535 } from '../typeorm/migrations/1673535312535-CreateUsers';
import { AddRoleIdToUsersTable1673544370683 } from '../typeorm/migrations/1673544370683-AddRoleIdToUsersTable';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  entities: [Role, User],
  migrations: [
    CreateRoles1673265903547,
    CreateUsers1673535312535,
    AddRoleIdToUsersTable1673544370683,
  ],
});
