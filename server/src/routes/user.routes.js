const express = require('express');
const router = express.Router();

const authenticateJwt = require('../middlewares/user.middleware');
const {
  updateProfile,
  deleteProfile,
  getUser,
} = require('../controllers/user.controller');

router.patch('/me', authenticateJwt, updateProfile);
router.delete('/me', authenticateJwt, deleteProfile);

router.get('/:userid', getUser);

module.exports = router;
