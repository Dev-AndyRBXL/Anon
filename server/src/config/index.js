require('dotenv').config();

const accessExpiresIn = '15m';
const refreshExpiresIn = '1y';

const env = {
  // Server
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || 'development',

  // DB
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbSalt: process.env.DB_SALT,
  dbDialect: 'postgres',

  // JWT
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  accessExpiresIn: accessExpiresIn,
  refreshExpiresIn: refreshExpiresIn,
};

// Utils
env.isProduction = () => env.nodeEnv === 'production';
env.isDevelopment = () => env.nodeEnv === 'development';

module.exports = env;
