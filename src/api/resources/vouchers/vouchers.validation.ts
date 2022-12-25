import { Joi, Segments } from 'celebrate';

import { VOUCHER_TYPE } from './vouchers.types';

export const GetVoucherSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
};

export const CreateVoucherSchema = {
  [Segments.BODY]: Joi.object()
    .options({ abortEarly: true })
    .keys({
      type: Joi.string()
        .valid(...Object.values(VOUCHER_TYPE))
        .default(VOUCHER_TYPE.FIXED),
      value: Joi.when('type', {
        is: VOUCHER_TYPE.FIXED,
        then: Joi.number().required().min(1),
        otherwise: Joi.number().required().min(1).max(100)
      })
    })
};

export const UpdateVoucherSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object()
    .options({ abortEarly: true })
    .keys({
      type: Joi.string().valid(...Object.values(VOUCHER_TYPE)),
      value: Joi.number().min(1)
    })
};

export const DeleteVoucherSchema = {
  ...GetVoucherSchema
};
