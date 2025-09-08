const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');
const authenticateJwt = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

const validationChain = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

router.post(
  '/signup',
  validationChain,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  signup
);
router.post(
  '/login',
  validationChain,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

router.get('/signup', authenticateJwt, (req, res) => {
  res.json({ message: 'Under maintenance', user: req.user }); // placeholder
});

router.get('/login', authenticateJwt, (req, res) => {
  res.json({ message: 'Under maintenance', user: req.user }); // placeholder
});

module.exports = router;
