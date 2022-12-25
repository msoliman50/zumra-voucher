import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty'
  },
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`
});

export default logger;
