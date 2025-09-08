const pino = require('pino');
const config = require('../config');

const logger = pino({
  transport: {
    target: config.isDevelopment() ? 'pino-pretty' : 'pino/file',
  },
});

module.exports = logger;
