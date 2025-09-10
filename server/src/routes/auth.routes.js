const express = require('express');
const router = express.Router();
const { signup, login, refresh, logout, updateProfile, deleteProfile } = require('../controllers/auth.controller');
const authenticateJwt = require('../middlewares/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes
router.patch('/update', authenticateJwt, updateProfile);
router.delete('/delete', authenticateJwt, deleteProfile);

module.exports = router;
