const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;
