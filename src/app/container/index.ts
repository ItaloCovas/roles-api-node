import { RolesRepository } from '../repositories/RolesRepository';
import { RolesController } from '../controllers/RolesController';
import { IRolesRepository } from '../../interfaces/roles';
import { container } from 'tsyringe';

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);

container.registerSingleton('RolesController', RolesController);
