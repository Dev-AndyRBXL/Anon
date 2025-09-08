const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, password, email });

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { user: { id: user.id, username: user.username } },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id.toString() !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await req.user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id.toString() !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { username, password, email, description } = req.body;

    if (username) req.user.username = username;
    if (password) req.user.password = password;
    if (email) req.user.email = email;
    if (description) req.user.description = description;

    await req.user.save();
    res.json({ message: 'User updated', user: req.user });
  } catch (err) {
    next(err);
  }
};
