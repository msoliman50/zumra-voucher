import { Router } from 'express';
import { celebrate } from 'celebrate';

import VouchersController from './vouchers.controller';
import * as vouchersValidation from './vouchers.validation';

// create vouchers router
const vouchersRouter: Router = Router();

// init vouchers routes
const vouchersController = new VouchersController();

vouchersRouter
  .route('/')
  .get(vouchersController.getAllVouchers)
  .post(
    celebrate(vouchersValidation.CreateVoucherSchema),
    vouchersController.createVoucher
  );

vouchersRouter
  .route('/:id')
  .get(
    celebrate(vouchersValidation.GetVoucherSchema),
    vouchersController.getVoucher
  )
  .put(
    celebrate(vouchersValidation.UpdateVoucherSchema),
    vouchersController.updateVoucher
  )
  .delete(
    celebrate(vouchersValidation.DeleteVoucherSchema),
    vouchersController.deleteVoucher
  );

export default vouchersRouter;
