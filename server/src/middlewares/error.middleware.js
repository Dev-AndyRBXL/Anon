const logger = require('../utils/logger');

module.exports = function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error with stack trace in development
  if (process.env.NODE_ENV === 'development') {
    logger.error(`[${status}] ${message}`);
    logger.error(err.stack);
  } else {
    logger.error(`[${status}] ${message}`);
  }

  // Consistent JSON error response
  const response = {
    success: false,
    message,
    errors: [],
  };

  // Include stack in dev
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
