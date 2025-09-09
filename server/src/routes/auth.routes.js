const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  deleteProfile,
  updateProfile,
} = require('../controllers/auth.controller');
const authenticateJwt = require('../middlewares/auth.middleware');
const {
  signupValidation,
  loginValidation,
  validateResult,
} = require('../utils/validation');

/**
 * The user must send a .json object here
 * It should be located inside req.body
 * Make sure we're using express.json()
 */

// Set the username to lowercase
const normalizeUsername = (req, res, next) => {
  if (req.body.username) req.body.username = req.body.username.toLowerCase();
  next();
};

// CREATE routes
router.post(
  '/signup',
  signupValidation,
  validateResult,
  normalizeUsername,
  signup
);

// READ routes
router.post(
  '/login',
  loginValidation,
  validateResult,
  normalizeUsername,
  login
);

// UPDATE routes
router.patch('/update', authenticateJwt, validateResult, updateProfile);

// DELETE
router.delete('/delete', authenticateJwt, deleteProfile);

module.exports = router;
