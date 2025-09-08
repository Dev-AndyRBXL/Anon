require('dotenv').config();

const env = {
  // server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // db
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbSalt: process.env.DB_SALT,
  dbDialect: 'postgres',

  // authentication
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};

module.exports = {
  ...env,
  isProduction: () => env.nodeEnv === 'production',
  isDevelopment: () => env.nodeEnv === 'development',
};
