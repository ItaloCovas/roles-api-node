import { RolesRepository } from '../repositories/RolesRepository';
import { RoleController } from '../controllers/RoleController';
import { IRolesRepository } from '../../interfaces/roles';
import { container } from 'tsyringe';
import { IUsersRepository } from '../../interfaces/users';
import { UsersRepository } from '../repositories/UsersRepository';
import { UserController } from '../controllers/UserController';
import { LoginController } from '../controllers/LoginController';
import { AvatarController } from '../controllers/AvatarController';

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);

container.registerSingleton('RoleController', RoleController);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton('UserController', UserController);
container.registerSingleton('LoginController', LoginController);
container.registerSingleton('AvatarController', AvatarController);
