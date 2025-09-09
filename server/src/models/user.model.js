const bcrypt = require('bcryptjs');
const { dbSalt } = require('../config');
const { userSchema } = require('../utils/schemas');

module.exports = (sequelize, DataTypes) => {
  // Define the user
  const User = sequelize.define('User', userSchema);

  User.beforeCreate(async (user) => {
    if (user.username) user.username = user.username.trim().toLowerCase();
    if (user.email) user.email = user.email.trim().toLowerCase();

    const salt = await bcrypt.genSalt(dbSalt);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    if (user.username) user.username = user.username.trim().toLowerCase();
    if (user.email) user.email = user.email.trim().toLowerCase();

    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(dbSalt);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  
  // User Utility functions
  /**
   * @param {The user password} password 
   * @returns {boolean}
   */
  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};

// Andy was here
