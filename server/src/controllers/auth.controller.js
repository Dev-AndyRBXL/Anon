const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

/**
 * Helper to send consistent error responses
 */
const sendError = (
  res,
  status = 500,
  message = 'Internal Server Error',
  errors = []
) => {
  return res.status(status).json({ success: false, message, errors });
};

/**
 * Signup a new user
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, displayname } = req.body;

    const user = await User.create({ username, email, password, displayname });

    res.status(201).json({
      success: true,
      message: 'User created',
      data: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (
      err.name === 'SequelizeValidationError' ||
      err.name === 'SequelizeUniqueConstraintError'
    ) {
      return sendError(
        res,
        400,
        'Validation error',
        err.errors.map((e) => e.message)
      );
    }
    next(err);
  }
};

/**
 * Login an existing user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid credentials', []);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role,
        description: user.description,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update own profile
 * PATCH /api/auth/update
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;

    const { username, email, password, displayname, description } = req.body;

    if (username) user.username = username.trim().toLowerCase();
    if (email) user.email = email.trim().toLowerCase();
    if (displayname) user.displayname = displayname.trim();
    if (description) user.description = description;
    if (password) user.password = password; // will be hashed via hook

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      data: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role,
        description: user.description,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete own profile
 * DELETE /api/user/profile
 */
exports.deleteProfile = async (req, res, next) => {
  try {
    const user = req.user;

    await user.destroy();

    res.json({
      success: true,
      message: 'Profile deleted successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
