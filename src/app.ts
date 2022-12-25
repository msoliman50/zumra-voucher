import express, { Request, Response } from 'express';

import Config from './config';
import logger from './config/logger';
import { createConnection } from './config/database';
import restRouter from './api/routes';
import { errorConverter, errorHandler } from './middlewares/errors';
import { Server } from 'http';

export default class Application {
  private app: express.Application;

  constructor() {
    // init app
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // healthcheck
    this.app.get('/healthcheck', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK' });
    });

    // init app routes
    this.app.use('/api', restRouter);

    // error handling
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  public async bootstrap(): Promise<Server> {
    // connect to db
    await createConnection();

    // start the app
    const PORT = Config.PORT;
    const NODE_ENV = Config.NODE_ENV;

    const server = this.app.listen(PORT, () =>
      logger.info(`App is up and running on port: ${PORT} in ${NODE_ENV} mode`)
    );

    return server;
  }
}
