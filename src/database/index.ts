import { DataSource } from 'typeorm';
import { Role } from '../entities/Role';
import { CreateRoles1673265903547 } from '../migrations/1673265903547-CreateRoles';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqlite',
  entities: [Role],
  migrations: [CreateRoles1673265903547],
});
