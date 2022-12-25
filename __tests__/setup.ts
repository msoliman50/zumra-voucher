import logger from '../src/config/logger';

const TEST_PROCESS_ENV = {
  PORT: 5050,
  NODE_ENV: 'testing',
  DB_URI: 'mongodb://user:password@localhost:27017/zumra-voucher-test'
};

// Set environment variables for test
process.env = Object.assign(process.env, TEST_PROCESS_ENV);
logger.level = 'silent';
