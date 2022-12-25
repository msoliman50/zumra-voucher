import { Router } from 'express';
import { celebrate } from 'celebrate';

import OrdersController from './orders.controller';
import * as ordersValidation from './orders.validation';

// create orders router
const ordersRouter: Router = Router();

// init orders routes
const ordersController = new OrdersController();

ordersRouter
  .route('/')
  .get(ordersController.getAllOrders)
  .post(
    celebrate(ordersValidation.CreateOrderSchema),
    ordersController.createOrder
  );

ordersRouter.get(
  '/:id',
  celebrate(ordersValidation.GetOrderSchema),
  ordersController.getOrder
);

export default ordersRouter;
