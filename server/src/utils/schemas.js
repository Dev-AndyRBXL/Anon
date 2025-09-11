const { DataTypes } = require('sequelize');

/**
 * @description Returns the Sequelize schema for the User model
 * @returns {object} The Sequelize model definition for User
 */
exports.userSchema = {
  displayname: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }, 
  },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
  createdAt: { type: DataTypes.DATE },
  // this is for soft delete
  deletedAt: { type: DataTypes.DATE, allowNull: true },
};
