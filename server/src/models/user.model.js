const bcrypt = require('bcryptjs');
const { dbSalt } = require('../config');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
  });

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(dbSalt);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(dbSalt);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
