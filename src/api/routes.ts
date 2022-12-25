import { Router } from 'express';

import vouchersRouter from './resources/vouchers/vouchers.router';
import usersRouter from './resources/users/users.router';
import ordersRouter from './resources/orders/orders.router';

// create the RESTful router
const restRouter: Router = Router();

// init resources routes
restRouter.use('/vouchers', vouchersRouter);
restRouter.use('/users', usersRouter);
restRouter.use('/orders', ordersRouter);

export default restRouter;
