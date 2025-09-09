const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');
const logger = require('../utils/logger');

// Initialize Sequelize
const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  dialect: config.dbDialect,
  port: config.dbPort,
  logging: (msg) => logger.info(msg),
  define: {
    // Avoid Sequelize creating timestamp fields automatically if not needed
    timestamps: true,
    underscored: true, // optional: use snake_case in DB
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, DataTypes);

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    await sequelize.sync({ alter: true });
    logger.info('Database synced successfully');
  } catch (err) {
    logger.error('Failed to connect or sync DB:', err);
    process.exit(1); 
  }
};

syncDatabase();

module.exports = db;
