import { Types } from 'mongoose';

import Order from './orders.model';
import logger from '../../../config/logger';
import VouchersService from '../vouchers/vouchers.service';
import UsersService from '../users/users.service';
import {
  BadRequestError,
  NotFoundError,
  MethodNotAllowedError
} from '../../../types/errors';

export default class OrdersService {
  private static instance: OrdersService;
  private vouchersService = VouchersService.Instance;
  private usersService = UsersService.Instance;

  private constructor() {}

  static get Instance() {
    if (!this.instance) {
      this.instance = new OrdersService();
    }
    return this.instance;
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('invalid order id');
    }
    const order = await Order.findById(id).populate('user').populate('voucher');
    if (!order) {
      throw new NotFoundError(`order[id=${id}] does not exist`);
    }
    return order;
  }

  async getOrder(id: string) {
    try {
      const order = await this.findById(id);
      logger.info('✅ order retrieved successfully');
      return order;
    } catch (error) {
      logger.error(`❌ failed to retrieve order, error: ${error}`);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const orders = await Order.find().populate('user').populate('voucher');
      logger.info('✅ orders retrieved successfully');
      return orders;
    } catch (error) {
      logger.error(`❌ failed to retrieve orders, error: ${error}`);
      throw error;
    }
  }

  async createOrder(userId: string, voucherId?: string) {
    try {
      // init user & voucher;
      let voucher;
      const user = await this.usersService.findById(userId);

      // init order
      const order = new Order();
      order.user = user._id;

      // validate voucher
      if (voucherId) {
        voucher = await this.vouchersService.findById(voucherId);

        if (voucher.usedBy || voucher.usedOn) {
          throw new MethodNotAllowedError(
            `voucher[id=${voucher._id}] is already used`
          );
        }
        order.voucher = voucher._id;
      }

      // save order
      await order.save();
      logger.info(`✅ order created successfully with id: ${order._id}`);

      if (voucher) {
        // TODO: this shoud be implemented as a transaction
        // update voucher
        voucher.usedBy = user._id;
        voucher.usedOn = order._id;
        await voucher.save();
      }

      return order;
    } catch (error) {
      logger.error(`❌ failed to create order, error: ${error}`);
      throw error;
    }
  }
}
