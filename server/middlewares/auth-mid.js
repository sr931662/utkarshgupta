const jwt = require('jsonwebtoken');
const User = require('../db/userSchema');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // 1) Check for token in headers
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2) Check for token in cookies
    else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.' 
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.'
      });
    }

    // 5) Check if account is approved
    if (!currentUser.isApproved) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account is not yet approved. Please contact administrator.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ 
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Middleware to check if user is active
// auth-mid.js - Fix the checkActive middleware
exports.checkActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });
    
    next();
  } catch (err) {
    console.error('Error in checkActive middleware:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong checking user activity'
    });
  }
};