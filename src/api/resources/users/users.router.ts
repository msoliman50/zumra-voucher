import { Router } from 'express';
import { celebrate } from 'celebrate';

import UsersController from './users.controller';
import * as usersValidation from './users.validation';

// create users router
const usersRouter: Router = Router();

// init users routes
const usersController = new UsersController();

usersRouter
  .route('/')
  .get(usersController.getAllUsers)
  .post(
    celebrate(usersValidation.CreateUserSchema),
    usersController.createUser
  );

usersRouter.get(
  '/:id',
  celebrate(usersValidation.GetUserSchema),
  usersController.getUser
);
export default usersRouter;
