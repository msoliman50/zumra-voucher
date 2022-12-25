import { Joi, Segments } from 'celebrate';

export const GetOrderSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
};

export const CreateOrderSchema = {
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().required(),
    voucherId: Joi.string()
  })
};
