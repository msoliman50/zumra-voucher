import { Types } from 'mongoose';

import Voucher from './vouchers.model';
import {
  CreateVoucherRequest,
  UpdateVoucherRequest,
  VOUCHER_TYPE
} from './vouchers.types';
import logger from '../../../config/logger';
import {
  BadRequestError,
  MethodNotAllowedError,
  NotFoundError
} from '../../../types/errors';

export default class VouchersService {
  private static instance: VouchersService;

  private constructor() {}

  static get Instance() {
    if (!this.instance) {
      this.instance = new VouchersService();
    }
    return this.instance;
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('invalid voucher id');
    }
    const voucher = await Voucher.findById(id)
      .populate('usedBy')
      .populate('usedOn');
    if (!voucher) {
      throw new NotFoundError(`voucher[id=${id}] does not exist`);
    }
    return voucher;
  }

  async getVoucher(id: string) {
    try {
      const voucher = await this.findById(id);
      logger.info('✅ voucher retrieved successfully');
      return voucher;
    } catch (error) {
      logger.error(`❌ failed to retrieve voucher, error: ${error}`);
      throw error;
    }
  }

  async getAllVouchers() {
    try {
      const vouchers = await Voucher.find()
        .populate('usedBy')
        .populate('usedOn');
      logger.info('✅ vouchers retrieved successfully');
      return vouchers;
    } catch (error) {
      logger.error(`❌ failed to retrieve vouchers, error: ${error}`);
      throw error;
    }
  }

  async createVoucher(createVoucherRequest: CreateVoucherRequest) {
    try {
      const voucher = await Voucher.create(createVoucherRequest);
      logger.info(`✅ voucher created successfully with id: ${voucher._id}`);
      return voucher;
    } catch (error) {
      logger.error(`❌ failed to create voucher, error: ${error}`);
      throw error;
    }
  }

  async updateVoucher(id: string, updateVoucherRequest: UpdateVoucherRequest) {
    try {
      const { type, value } = updateVoucherRequest;
      const voucher = await this.findById(id);

      // can't update used voucher
      if (voucher.usedBy || voucher.usedOn) {
        throw new MethodNotAllowedError('updating used voucher is not allowed');
      }

      // can't update percentage voucher to be more than 100%
      if (
        value &&
        value > 100 &&
        (type === VOUCHER_TYPE.PERCENTAGE ||
          (voucher.type === VOUCHER_TYPE.PERCENTAGE && !type))
      ) {
        throw new BadRequestError(
          `percentage voucher's value can't exceed 100%`
        );
      }
      return Voucher.findByIdAndUpdate(
        id,
        { ...updateVoucherRequest },
        { new: true }
      );
    } catch (error) {
      logger.error(`❌ failed to update voucher, error: ${error}`);
      throw error;
    }
  }

  async deleteVoucher(id: string) {
    try {
      const voucher = await this.findById(id);

      // can't delete used voucher
      if (voucher.usedBy || voucher.usedOn) {
        throw new MethodNotAllowedError('deleting used voucher is not allowed');
      }

      await Voucher.deleteOne({ _id: voucher._id });
      logger.info('✅ voucher deleted successfully');
    } catch (error) {
      logger.error(`❌ failed to delete voucher, error: ${error}`);
      throw error;
    }
  }
}
