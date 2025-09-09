const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

/**
 * Signup a new user
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, displayname } = req.body;

    const user = await User.create({ username, email, password, displayname });

    res.status(201).json({
      message: 'User created',
      user: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

/**
 * Get own account info
 * GET /api/user/profile
 */
exports.getAccount = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      id: user.id,
      username: user.username,
      displayname: user.displayname,
      email: user.email,
      role: user.role,
      description: user.description,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update own account
 * PUT /api/user/profile
 */
exports.updateAccount = async (req, res, next) => {
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
      message: 'Account updated',
      user: {
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
 * Delete own account
 * DELETE /api/user/profile
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = req.user;

    await user.destroy();

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
