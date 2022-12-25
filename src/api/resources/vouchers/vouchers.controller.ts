import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../../../types/httpStatus';
import VouchersService from './vouchers.service';
import { CreateVoucherRequest, UpdateVoucherRequest } from './vouchers.types';

export default class VouchersController {
  private vouchersService = VouchersService.Instance;

  getAllVouchers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.vouchersService.getAllVouchers();
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'vouchers retrieved successfully',
        data
      });
    } catch (error) {
      return next(error);
    }
  };

  getVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { [key: string]: string };
      const voucher = await this.vouchersService.getVoucher(id);
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'voucher retrieved successfully',
        data: { voucher }
      });
    } catch (error) {
      return next(error);
    }
  };

  createVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createVoucherRequest: CreateVoucherRequest = req.body;

      const voucher = await this.vouchersService.createVoucher(
        createVoucherRequest
      );
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: 'voucher created successfully',
        data: { voucher }
      });
    } catch (error) {
      return next(error);
    }
  };

  updateVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { [key: string]: string };
      const updateVoucherRequest: UpdateVoucherRequest = req.body;

      const voucher = await this.vouchersService.updateVoucher(
        id,
        updateVoucherRequest
      );
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'voucher updated successfully',
        data: { voucher }
      });
    } catch (error) {
      return next(error);
    }
  };

  deleteVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { [key: string]: string };
      await this.vouchersService.deleteVoucher(id);
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'voucher deleted successfully'
      });
    } catch (error) {
      return next(error);
    }
  };
}
