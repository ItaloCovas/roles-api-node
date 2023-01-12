import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Joi, Segments } from 'celebrate';

import { RolesController } from './app/controllers/RolesController';

export const routes = Router();
const rolesController = container.resolve(RolesController);

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello World!' });
});

routes.get(
  '/roles',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number(),
      limit: Joi.number(),
    }),
  }),
  rolesController.index,
);

routes.get(
  '/roles/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  rolesController.getRole,
);

routes.post(
  '/roles',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  rolesController.store,
);

routes.put(
  '/roles/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  rolesController.update,
);

routes.delete(
  '/roles/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  rolesController.delete,
);
