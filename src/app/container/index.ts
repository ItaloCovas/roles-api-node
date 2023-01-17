import { RolesRepository } from '../repositories/RolesRepository';
import { RoleController } from '../controllers/RoleController';
import { IRolesRepository } from '../../interfaces/Roles';
import { container } from 'tsyringe';
import { IUsersRepository } from '../../interfaces/Users';
import { UsersRepository } from '../repositories/UsersRepository';
import { UserController } from '../controllers/UserController';
import { LoginController } from '../controllers/LoginController';
import { AvatarController } from '../controllers/AvatarController';
import { IRefreshTokenRepository } from '../../interfaces/RefreshToken';
import { RefreshTokenRepository } from '../repositories/RefreshTokensRepository';
import { RefreshTokenController } from '../controllers/RefreshTokenController';

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);

container.registerSingleton('RoleController', RoleController);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IRefreshTokenRepository>(
  'RefreshTokenRepository',
  RefreshTokenRepository,
);

container.registerSingleton('UserController', UserController);
container.registerSingleton('LoginController', LoginController);
container.registerSingleton('AvatarController', AvatarController);
container.registerSingleton('RefreshTokenController', RefreshTokenController);
