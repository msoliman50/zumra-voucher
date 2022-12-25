import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../../../types/httpStatus';
import UsersService from './users.service';

export default class UsersController {
  private usersService = UsersService.Instance;

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.usersService.getAllUsers();
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'users retrieved successfully',
        data
      });
    } catch (error) {
      return next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { [key: string]: string };
      const user = await this.usersService.getUser(id);
      return res.status(HTTP_STATUS.SUCCESS).json({
        status: HTTP_STATUS.SUCCESS,
        message: 'user retrieved successfully',
        data: { user }
      });
    } catch (error) {
      return next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const user = await this.usersService.createUser(name);
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: 'user created successfully',
        data: { user }
      });
    } catch (error) {
      return next(error);
    }
  };
}
