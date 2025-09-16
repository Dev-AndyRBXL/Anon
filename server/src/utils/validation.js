const { body, validationResult } = require('express-validator');
const config = require('../config');

// ---- Used in Auth.routes.js ----
/**
 * Validates the .json body sent from the client
 * (usually via a form)
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

const signupValidation = [
  body('displayname')
    .optional()
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage('Displayname must be between 3 and 32 characters'),

  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage('Username must be between 3 and 32 characters')
    .matches(/^[a-z0-9_.]+$/)
    .withMessage(
      "Username can only contain lowercase letters, numbers, '_' and '.'"
    ),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Email is invalid'),

  body('password')
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be at least 8 characters long'),
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage("Password can't be empty"),
];
// --------------------------------

module.exports = {
  validateResult,
  validateApiKey,
  signupValidation,
  loginValidation,
};
