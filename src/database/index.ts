import { DataSource } from 'typeorm';
import { RefreshToken } from '../entities/RefreshToken';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { CreateRoles1673265903547 } from '../typeorm/migrations/1673265903547-CreateRoles';
import { CreateUsers1673535312535 } from '../typeorm/migrations/1673535312535-CreateUsers';
import { AddRoleIdToUsersTable1673544370683 } from '../typeorm/migrations/1673544370683-AddRoleIdToUsersTable';
import { CreateRefreshToken1673966262075 } from '../typeorm/migrations/1673966262075-CreateRefreshToken';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  entities: [Role, User, RefreshToken],
  migrations: [
    CreateRoles1673265903547,
    CreateUsers1673535312535,
    AddRoleIdToUsersTable1673544370683,
    CreateRefreshToken1673966262075,
  ],
});
