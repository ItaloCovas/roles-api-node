import 'dotenv/config';
import 'reflect-metadata';
import './app/container';
import 'express-async-errors';
import uploadConfig from './config/upload';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import swagger from 'swagger-ui-express';

import swaggerFile from './swagger.json';
import { routes } from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { dataSource } from './database';

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use('/files', express.static(uploadConfig.directory));
    app.use('/docs', swagger.serve, swagger.setup(swaggerFile));
    app.use(routes);
    app.use(errors());

    app.use(errorMiddleware);

    app.listen(process.env.PORT, () => {
      console.log(`Server started at http://localhost:${process.env.PORT} 🔥`);
    });
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err);
  });
