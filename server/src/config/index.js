require('dotenv').config();

const accessExpiresIn = '15m';
const refreshExpiresIn = '1y';

const env = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY,

  // DB
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbSalt: process.env.DB_SALT,
  dbDialect: 'postgres',

  // Authentication
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  accessExpiresIn:
    process.env.NODE_ENV === 'production' ? accessExpiresIn : '30s',
  refreshExpiresIn:
    process.env.NODE_ENV === 'production' ? refreshExpiresIn : '1h',
};

// Utils
env.isProduction = () => env.nodeEnv === 'production';
env.isDevelopment = () => env.nodeEnv === 'development';

module.exports = env;
