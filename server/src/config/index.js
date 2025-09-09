require('dotenv').config();

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
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.NODE_ENV === 'production' ? '30d' : '1h',
};

// Utils
env.isProduction = () => env.nodeEnv === 'production';
env.isDevelopment = () => env.nodeEnv === 'development';

module.exports = env;
