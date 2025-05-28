const express = require('express');
const {
  login,
  forgotPassword,
  resetPassword,
  getMe,
  refreshToken
} = require('../controllers/auth-controller');
const authMid = require("../middlewares/auth-mid");

const router = express.Router();

router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.get('/me', authMid.protect, getMe);
router.post('/refresh', refreshToken);

module.exports = router;