import * as dotEnv from 'dotenv';

// load configurations file
dotEnv.config({ path: `${__dirname}/../../.env` });

// init config object
const Config = {
  PORT: process.env.PORT || 9090,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URI:
    process.env.DB_URI ||
    'mongodb://user:password@localhost:27017/zumra-voucher'
};

export default Config;
