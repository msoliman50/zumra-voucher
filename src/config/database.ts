import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

import Config from './';
import logger from './logger';

const createConnection = async () => {
  try {
    await mongoose.connect(Config.DB_URI, { authSource: 'admin' });
    logger.info('connected to database...');
  } catch (error) {
    logger.error(`failed to connect to database: ${error}`);
    process.exit(1);
  }
};

export { mongoose, createConnection };
