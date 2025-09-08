const logger = require('../utils/logger');

// Basic error logger
module.exports = function (err, req, res, _) {
  const { message, status = 500 } = err;
  logger.error(message);
  res.status(status).json(err);
};
