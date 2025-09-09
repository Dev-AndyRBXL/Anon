const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const cors = require('cors');
const { validateApiKey } = require('./utils/validation');

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

/** Template
 * POST /endpoint HTTP/1.1
 * Host: example.com
 * x-api-key: [your-api-key]
 * Authorization: Bearer [your-jwt-token]
 * Content-Type: application/json

 * {
 * ...[other data]
 * }
 * 
 */

app.use('/api/auth', validateApiKey, authRoutes);

app.use(errorMiddleware);

module.exports = app;
