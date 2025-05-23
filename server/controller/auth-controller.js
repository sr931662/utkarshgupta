// controllers/auth-controller.js
const User = require('../db/userSchema');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Cookie options
const cookieOptions = {
  expires: new Date(
    Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 30) * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// User Registration
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Prevent duplicate registration
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const newUser = await User.create({
      email,
      password,
      name,
      role: req.body.role || 'admin' // Default to admin if not specified
    });

    // Secure response (exclude password)
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

// User Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.verifyPassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 4) Generate token
    const token = signToken(user._id);

    // 5) Send token in cookie and response
    res.cookie('jwt', token, cookieOptions);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// Protect Routes (Middleware)
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from header/cookie
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in!', 401));
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('User no longer exists', 401));
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
      }
    }

    // 5) Grant access
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Role-based access control
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1) Get user
    const user = await User.findById(req.user.id).select('+password');

    // 2) Verify current password
    if (!(await user.verifyPassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // 3) Update password
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    // 4) Log in with new token
    const token = signToken(user._id);
    res.cookie('jwt', token, cookieOptions);
    
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(err);
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};