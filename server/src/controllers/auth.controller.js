const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');
const { Op } = require('sequelize');

const sendError = (
  res,
  status = 500,
  message = 'Internal Server Error',
  errors = []
) => {
  return res.status(status).json({ success: false, message, errors });
};

// Signup
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
        displayname: user.displayname ?? '',
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

// Login
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ where: { [Op.or]: [
      { username: identifier },
      { email: identifier }
    ] } });
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid credentials', []);
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.accessSecret,
      { expiresIn: config.accessExpiresIn }
    );

    const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
      expiresIn: config.refreshExpiresIn,
    });

    // Send refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
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

// Refresh token
exports.refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;  
  if (!refreshToken) return sendError(res, 401, 'Refresh token required');

  jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
    if (err) return sendError(res, 403, 'Invalid or expired refresh token');

    const accessToken = jwt.sign({ id: decoded.id }, config.accessSecret, {
      expiresIn: config.accessExpiresIn,
    });

    // Rotate refresh token
    const newRefreshToken = jwt.sign({ id: decoded.id }, config.refreshSecret, {
      expiresIn: config.refreshExpiresIn,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({ success: true, accessToken });
  });
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
};

// Update profile
// exports.updateProfile = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const { username, email, password, displayname, description } = req.body;

//     if (username) user.username = username.trim().toLowerCase();
//     if (email) user.email = email.trim().toLowerCase();
//     if (displayname) user.displayname = displayname.trim();
//     if (description) user.description = description;
//     if (password) user.password = password; // hashed via hook

//     await user.save();

//     res.json({ success: true, message: 'Profile updated', data: user });
//   } catch (err) {
//     next(err);
//   }
// };

// Delete profile
// exports.deleteProfile = async (req, res, next) => {
//   try {
//     const user = req.user;
//     await user.destroy();

//     res.clearCookie('refreshToken');
//     res.json({ success: true, message: 'Profile deleted', data: null });
//   } catch (err) {
//     next(err);
//   }
// };
