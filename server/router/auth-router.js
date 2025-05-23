// routes/auth-router.js
const express = require('express');
const authController = require('../controller/auth-controller');
const router = express.Router();

// Auth Routes
router.post('/register', authController.register); // Only for initial setup
router.post('/login', authController.login);

// Protected Routes (Require JWT)
router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);

module.exports = router;