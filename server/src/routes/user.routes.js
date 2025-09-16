const express = require('express');
const router = express.Router();

const authenticateJwt = require('../middlewares/users.middleware');
const {
  updateProfile,
  deleteProfile,
} = require('../controllers/users.controller');

router.patch('/me', authenticateJwt, updateProfile);
router.delete('/me', authenticateJwt, deleteProfile);

module.exports = router;
