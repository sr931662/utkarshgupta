// routes/auth-router.js
const express = require('express');
const {
  login,
  // forgotPassword, // Optional: if you're still using token-based reset
  // resetPassword,  // Optional: same as above
  refreshToken,
  updatePassword,
  getMe,
  checkEmail,
  sendOTP,
  verifyOTPAndResetPassword
} = require('../controllers/auth-controller');

const authMid = require("../middlewares/auth-mid");
const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp-reset', verifyOTPAndResetPassword);
router.post('/refresh', refreshToken);
router.post('/check-email', checkEmail);

// Optional token-based reset (only keep if needed)
// router.post('/forgotPassword', forgotPassword);
// router.patch('/resetPassword/:token', resetPassword);

// Protected routes (require authentication)
router.use(authMid.protect);

router.get('/me', authMid.checkActive, getMe);
router.patch('/updatePassword', authMid.checkActive, updatePassword);

// Admin routes
router.use(authMid.restrictTo('superadmin', 'manager'));

// You can add admin-specific routes here

module.exports = router;








































// const express = require('express');
// const {
//   login,
//   forgotPassword,
//   resetPassword,
//   getMe,
//   refreshToken,
//   updatePassword,
//   checkEmail,
//   sendOTP,
//   verifyOTPAndResetPassword
// } = require('../controllers/auth-controller');
// const authMid = require("../middlewares/auth-mid");

// const router = express.Router();

// router.post('/login', login);
// router.post('/forgotPassword', forgotPassword);
// router.patch('/resetPassword/:token', resetPassword);
// router.post('/check-email', checkEmail); // Add this new route
// router.post('/refresh', refreshToken);

// // Protected routes (require authentication)
// router.use(authMid.protect);

// router.get('/me', authMid.checkActive, getMe);
// router.patch('/updatePassword', authMid.checkActive, updatePassword);

// router.post('/send-otp', sendOTP);                          // New route
// router.post('/verify-otp-reset', verifyOTPAndResetPassword); // New route
// // Admin restricted routes
// router.use(authMid.restrictTo('superadmin', 'manager'));

// // Add admin-specific routes here if needed

// module.exports = router;












// // const express = require('express');
// // const {
// //   login,
// //   forgotPassword,
// //   resetPassword,
// //   getMe,
// //   refreshToken
// // } = require('../controllers/auth-controller');
// // const authMid = require("../middlewares/auth-mid");

// // const router = express.Router();

// // router.post('/login', login);
// // router.post('/forgotPassword', forgotPassword);
// // router.patch('/resetPassword/:token', resetPassword);
// // router.get('/me', authMid.protect, getMe);
// // router.post('/refresh', refreshToken);

// // module.exports = router;