const { DataTypes } = require('sequelize');

/**
 * @description Returns the Sequelize schema for the User model
 * @returns {object} The Sequelize model definition for User
 */
exports.userSchema = {
  displayname: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }, // removed stray "z"
  },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
};
