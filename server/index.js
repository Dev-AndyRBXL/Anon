const app = require('./src/app');
const { sequelize } = require('./src/models');
const { port } = require('./src/config');
const logger = require('./src/utils/logger');
const config = require('./src/config');

sequelize.sync({ force: false }).then(() => {
  app.listen(config.port, () => {
    if (config.nodeEnv === 'development') {
      logger.info(`Server running on http://localhost:${port}`);
    }
  });
});
