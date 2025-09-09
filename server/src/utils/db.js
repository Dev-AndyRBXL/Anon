const { User } = require('../models');

/**
 * Get all users
 * @returns {Promise<Array>} Array of user instances
 */
const getAllUsers = async () => {
  return await User.findAll();
};

/**
 * Get a user by ID
 * @param {number|string} id
 * @returns {Promise<User|null>}
 */
const getUserById = async (id) => {
  return await User.findByPk(id);
};

/**
 * Get a user by username
 * @param {string} username
 * @returns {Promise<User|null>}
 */
const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

/**
 * Delete a user by ID
 * @param {number|string} id
 * @returns {Promise<number>} Number of rows deleted
 */
const deleteUserById = async (id) => {
  const deletedCount = await User.destroy({ where: { id } });
  return deletedCount;
};

/**
 * Update user by ID
 * @param {number|string} id
 * @param {object} data Fields to update
 * @returns {Promise<User|null>} Updated user instance
 */
const updateUserById = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  Object.assign(user, data);
  await user.save();
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  deleteUserById,
  updateUserById,
};
