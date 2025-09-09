const pino = require('pino');
const config = require('../config');

// Use pino-pretty ONLY during development
const logger = pino({
  transport: {
    target: config.isDevelopment() ? 'pino-pretty' : 'pino/file',
  },
});

module.exports = logger;
