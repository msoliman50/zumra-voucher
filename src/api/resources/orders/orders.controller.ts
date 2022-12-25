import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../../../types/httpStatus';
import OrdersService from './orders.service';

export default class OrdersController {
  private ordersService = OrdersService.Instance;

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.ordersService.getAllOrders();
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'orders retrieved successfully',
        data
      });
    } catch (error) {
      return next(error);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { [key: string]: string };
      const order = await this.ordersService.getOrder(id);
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'order retrieved successfully',
        data: { order }
      });
    } catch (error) {
      return next(error);
    }
  };

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, voucherId } = req.body;

      const order = await this.ordersService.createOrder(userId, voucherId);
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: 'order created successfully',
        data: { order }
      });
    } catch (error) {
      return next(error);
    }
  };
}
