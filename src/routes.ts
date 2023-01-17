import { Router } from 'express';
import { container } from 'tsyringe';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from './config/upload';

import { RoleController } from './app/controllers/RoleController';
import { UserController } from './app/controllers/UserController';
import { LoginController } from './app/controllers/LoginController';
import { AvatarController } from './app/controllers/AvatarController';

import { authMiddleware } from './middlewares/authMiddleware';
import { RefreshTokenController } from './app/controllers/RefreshTokenController';
import { addUserInfoMiddleware } from './middlewares/addUserInfoMiddleware';

export const routes = Router();
const roleController = container.resolve(RoleController);
const userController = container.resolve(UserController);
const loginController = container.resolve(LoginController);
const avatarController = container.resolve(AvatarController);
const refreshTokenController = container.resolve(RefreshTokenController);

const upload = multer(uploadConfig);

routes.get('/', (request, response) => {
  return response.json({ message: 'Hello World!' });
});

// Login

routes.post(
  '/users/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  loginController.login,
);

routes.post(
  '/users/refresh_token',
  addUserInfoMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      refresh_token: Joi.string().required(),
    }),
  }),
  refreshTokenController.create,
);

routes.use(authMiddleware);

routes.get(
  '/roles',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number(),
      limit: Joi.number(),
    }),
  }),
  roleController.index,
);

routes.get(
  '/roles/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  roleController.getRole,
);

routes.post(
  '/roles',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),
  roleController.store,
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
  roleController.update,
);

routes.delete(
  '/roles/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required(),
    }),
  }),
  roleController.delete,
);

// Users

routes.post(
  '/users',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      isAdmin: Joi.boolean().required(),
      roleId: Joi.string().uuid().required(),
    }),
  }),
  userController.store,
);

routes.get(
  '/users',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number(),
      limit: Joi.number(),
    }),
  }),
  userController.index,
);

routes.get('/profile', userController.getUserProfile);
routes.put(
  '/profile',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().optional(),
      oldPassword: Joi.string(),
      passwordConfirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }),
  }),
  userController.updateUserProfile,
);

routes.patch('/users/avatar', upload.single('avatar'), avatarController.upload);
