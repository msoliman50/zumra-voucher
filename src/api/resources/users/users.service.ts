import { Types } from 'mongoose';

import User from './users.model';
import logger from '../../../config/logger';
import { BadRequestError, NotFoundError } from '../../../types/errors';

export default class UsersService {
  private static instance: UsersService;

  private constructor() {}

  static get Instance() {
    if (!this.instance) {
      this.instance = new UsersService();
    }
    return this.instance;
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('invalid user id');
    }
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(`user[id=${id}] does not exist`);
    }
    return user;
  }

  async getUser(id: string) {
    try {
      const user = await this.findById(id);
      logger.info('✅ user retrieved successfully');
      return user;
    } catch (error) {
      logger.error(`❌ failed to retrieve user, error: ${error}`);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find();
      logger.info('✅ users retrieved successfully');
      return users;
    } catch (error) {
      logger.error(`❌ failed to retrieve users, error: ${error}`);
      throw error;
    }
  }

  async createUser(name: string) {
    try {
      const user = await User.create({ name });
      logger.info(`✅ user created successfully with id: ${user._id}`);
      return user;
    } catch (error) {
      logger.error(`❌ failed to create user, error: ${error}`);
      throw error;
    }
  }
}
