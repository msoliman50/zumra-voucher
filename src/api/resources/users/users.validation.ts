import { Joi, Segments } from 'celebrate';

export const GetUserSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
};

export const CreateUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2)
  })
};
