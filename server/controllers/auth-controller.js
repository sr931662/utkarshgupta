const User = require('../db/userSchema');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { promisify } = require('util');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if user is approved
    if (!user.isApproved) {
      return next(
        new AppError('Your account is pending approval by admin', 403)
      );
    }

    // 4) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
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
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

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

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random OTP
    const otp = user.createOTP();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const message = `Your password reset OTP is ${otp}. This OTP is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset OTP (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'OTP sent to email!',
      });
    } catch (err) {
      user.passwordResetOTP = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // 2) Verify OTP
    if (!user.verifyOTP(req.body.otp)) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    // 3) Update password
    user.password = req.body.newPassword;
    user.passwordResetOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.newPassword;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // Filter out unwanted fields that are not allowed to be updated
    const filteredBody = { ...req.body };
    
    // Handle file upload for profile image if needed
    if (req.file) {
      filteredBody.profileImage = req.file.path;
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};























































// // // const User = require('../db/userSchema');
// // // const jwt = require('jsonwebtoken');
// // // const bcrypt = require('bcryptjs');
// // // const crypto = require('crypto');
// // // const sendEmail = require('../utils/email');

// // // // Helper function to create token
// // // const signToken = (id, role) => {
// // //   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
// // //     expiresIn: process.env.JWT_EXPIRES_IN,
// // //   });
// // // };

// // // // Helper function to create and send token
// // // const createSendToken = (user, statusCode, res) => {
// // //   const token = signToken(user._id, user.role);
// // //   const cookieOptions = {
// // //     expires: new Date(
// // //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// // //     ),
// // //     httpOnly: true,
// // //     secure: process.env.NODE_ENV === 'production',
// // //   };

// // //   res.cookie('jwt', token, cookieOptions);
// // //   user.password = undefined;

// // //   res.status(statusCode).json({
// // //     status: 'success',
// // //     token,
// // //     data: {
// // //       user,
// // //     },
// // //   });
// // // };

// // // // Login controller
// // // exports.login = async (req, res, next) => {
// // //   try {
// // //     const { email, password } = req.body;

// // //     if (!email || !password) {
// // //       return res.status(400).json({
// // //         status: 'fail',
// // //         message: 'Please provide email and password',
// // //       });
// // //     }

// // //     const user = await User.findOne({ email }).select('+password');

// // //     if (!user || !(await bcrypt.compare(password, user.password))) {
// // //       return res.status(401).json({
// // //         status: 'fail',
// // //         message: 'Incorrect email or password',
// // //       });
// // //     }

// // //     if (!user.isApproved) {
// // //       return res.status(403).json({
// // //         status: 'fail',
// // //         message: 'Account not approved. Please contact superadmin.',
// // //       });
// // //     }

// // //     createSendToken(user, 200, res);
// // //   } catch (err) {
// // //     res.status(500).json({
// // //       status: 'error',
// // //       message: 'Something went wrong',
// // //       error: err.message,
// // //     });
// // //   }
// // // };

// // // // Forgot password controller
// // // exports.forgotPassword = async (req, res, next) => {
// // //   try {
// // //     const user = await User.findOne({ email: req.body.email });
// // //     if (!user) {
// // //       return res.status(404).json({
// // //         status: 'fail',
// // //         message: 'There is no user with that email address.',
// // //       });
// // //     }

// // //     const resetToken = crypto.randomBytes(32).toString('hex');
// // //     user.passwordResetToken = crypto
// // //       .createHash('sha256')
// // //       .update(resetToken)
// // //       .digest('hex');
// // //     user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
// // //     await user.save({ validateBeforeSave: false });

// // //     const resetURL = `${req.protocol}://${req.get(
// // //       'host'
// // //     )}/api/auth/resetPassword/${resetToken}`;

// // //     const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

// // //     try {
// // //       await sendEmail({
// // //         email: user.email,
// // //         subject: 'Your password reset token (valid for 10 min)',
// // //         message,
// // //       });

// // //       res.status(200).json({
// // //         status: 'success',
// // //         message: 'Token sent to email!',
// // //       });
// // //     } catch (err) {
// // //       user.passwordResetToken = undefined;
// // //       user.passwordResetExpires = undefined;
// // //       await user.save({ validateBeforeSave: false });

// // //       return res.status(500).json({
// // //         status: 'error',
// // //         message: 'There was an error sending the email. Try again later!',
// // //       });
// // //     }
// // //   } catch (err) {
// // //     res.status(500).json({
// // //       status: 'error',
// // //       message: 'Something went wrong',
// // //       error: err.message,
// // //     });
// // //   }
// // // };

// // // // Get current user
// // // exports.getMe = async (req, res, next) => {
// // //   try {
// // //     const user = await User.findById(req.user.id).select('-password');
// // //     res.status(200).json({
// // //       status: 'success',
// // //       data: {
// // //         user
// // //       }
// // //     });
// // //   } catch (err) {
// // //     next(err);
// // //   }
// // // };

// // // // Reset password controller
// // // exports.resetPassword = async (req, res, next) => {
// // //   try {
// // //     const hashedToken = crypto
// // //       .createHash('sha256')
// // //       .update(req.params.token)
// // //       .digest('hex');

// // //     const user = await User.findOne({
// // //       passwordResetToken: hashedToken,
// // //       passwordResetExpires: { $gt: Date.now() },
// // //     });

// // //     if (!user) {
// // //       return res.status(400).json({
// // //         status: 'fail',
// // //         message: 'Token is invalid or has expired',
// // //       });
// // //     }

// // //     user.password = await bcrypt.hash(req.body.password, 12);
// // //     user.passwordResetToken = undefined;
// // //     user.passwordResetExpires = undefined;
// // //     await user.save();

// // //     createSendToken(user, 200, res);
// // //   } catch (err) {
// // //     res.status(500).json({
// // //       status: 'error',
// // //       message: 'Something went wrong',
// // //       error: err.message,
// // //     });
// // //   }
// // // };

// // // // Refresh token controller
// // // exports.refreshToken = async (req, res, next) => {
// // //   try {
// // //     const token = req.headers.authorization?.split(' ')[1];
// // //     if (!token) {
// // //       return res.status(401).json({
// // //         status: 'fail',
// // //         message: 'No token provided',
// // //       });
// // //     }

// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     const newToken = signToken(decoded.id, decoded.role);
    
// // //     res.status(200).json({
// // //       status: 'success',
// // //       token: newToken,
// // //     });
// // //   } catch (err) {
// // //     res.status(401).json({
// // //       status: 'fail',
// // //       message: 'Invalid or expired token',
// // //     });
// // //   }
// // // };
























// // const User = require('../db/userSchema');
// // const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcryptjs');
// // const crypto = require('crypto');
// // const sendEmail = require('../utils/email');

// // // Helper function to create token
// // const signToken = (id, role) => {
// //   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
// //     expiresIn: process.env.JWT_EXPIRES_IN,
// //   });
// // };

// // // Helper function to create and send token
// // const createSendToken = (user, statusCode, res) => {
// //   const token = signToken(user._id, user.role);
// //   const cookieOptions = {
// //     expires: new Date(
// //       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// //     ),
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === 'production',
// //   };

// //   res.cookie('jwt', token, cookieOptions);
  
// //   // Remove sensitive data from output
// //   user.password = undefined;
// //   user.passwordResetToken = undefined;
// //   user.passwordResetExpires = undefined;

// //   res.status(statusCode).json({
// //     status: 'success',
// //     token,
// //     data: {
// //       user,
// //     },
// //   });
// // };

// // // Login controller
// // exports.login = async (req, res, next) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (!email || !password) {
// //       return res.status(400).json({
// //         status: 'fail',
// //         message: 'Please provide email and password',
// //       });
// //     }

// //     const user = await User.findOne({ email }).select('+password');

// //     if (!user || !(await user.comparePassword(password))) {
// //       return res.status(401).json({
// //         status: 'fail',
// //         message: 'Incorrect email or password',
// //       });
// //     }

// //     if (!user.isApproved) {
// //       return res.status(403).json({
// //         status: 'fail',
// //         message: 'Account not approved. Please contact superadmin.',
// //       });
// //     }

// //     // Update last active timestamp
// //     user.lastActive = Date.now();
// //     await user.save({ validateBeforeSave: false });

// //     createSendToken(user, 200, res);
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong',
// //       error: err.message,
// //     });
// //   }
// // };


// // // Check email existence
// // exports.checkEmail = async (req, res, next) => {
// //   try {
// //     const { email } = req.body;
    
// //     if (!email) {
// //       return res.status(400).json({
// //         status: 'fail',
// //         message: 'Please provide an email address'
// //       });
// //     }

// //     const user = await User.findOne({ email });
    
// //     res.status(200).json({
// //       status: 'success',
// //       exists: !!user // Returns true if user exists, false otherwise
// //     });
    
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong',
// //       error: err.message
// //     });
// //   }
// // };
// // // OTP Controller
// // exports.sendOTP = async (req, res) => {
// //   try {
// //     const { email } = req.body;
    
// //     // 1. Check if user exists
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(404).json({
// //         status: 'fail',
// //         message: 'No user found with that email'
// //       });
// //     }

// //     // 2. Generate and save OTP
// //     const otp = user.createOTP();
// //     await user.save({ validateBeforeSave: false });

// //     // 3. Send OTP via EmailJS
// //     try {
// //       await emailjs.send(
// //         process.env.EMAILJS_SERVICE_ID,
// //         process.env.EMAILJS_TEMPLATE_ID,
// //         {
// //           to_email: user.email,
// //           otp_code: otp,
// //           expiration: "10 minutes"
// //         },
// //         process.env.EMAILJS_PUBLIC_KEY
// //       );

// //       res.status(200).json({
// //         status: 'success',
// //         message: 'OTP sent successfully'
// //       });
// //     } catch (err) {
// //       user.clearOTP();
// //       await user.save({ validateBeforeSave: false });
      
// //       return res.status(500).json({
// //         status: 'error',
// //         message: 'Failed to send OTP email'
// //       });
// //     }
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong'
// //     });
// //   }
// // };

// // // Verify OTP and Reset Password
// // exports.verifyOTPAndResetPassword = async (req, res) => {
// //   try {
// //     const { email, otp, newPassword } = req.body;
    
// //     // 1. Get user
// //     const user = await User.findOne({ email }).select('+passwordResetOTP');
// //     if (!user) {
// //       return res.status(404).json({
// //         status: 'fail',
// //         message: 'No user found with that email'
// //       });
// //     }

// //     // 2. Verify OTP
// //     if (!user.verifyOTP(otp)) {
// //       return res.status(400).json({
// //         status: 'fail',
// //         message: 'Invalid or expired OTP'
// //       });
// //     }

// //     // 3. Update password
// //     user.password = newPassword;
// //     user.passwordChangedAt = Date.now();
// //     user.clearOTP();
// //     await user.save();

// //     // 4. Log the user in (optional)
// //     createSendToken(user, 200, res);
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong'
// //     });
// //   }
// // };
// // // Forgot password controller
// // // In auth-controller.js, update the forgotPassword controller:
// // exports.forgotPassword = async (req, res, next) => {
// //   try {
// //     const user = await User.findOne({ email: req.body.email });
// //     if (!user) {
// //       return res.status(404).json({
// //         status: 'fail',
// //         message: 'There is no user with that email address.',
// //       });
// //     }

// //     const resetToken = user.createPasswordResetToken();
// //     await user.save({ validateBeforeSave: false });

// //     // Use frontend URL instead of API URL
// //     const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

// //     try {
// //       // Use the Email class
// //       const email = new Email(user, resetURL);
// //       await email.sendPasswordReset();

// //       res.status(200).json({
// //         status: 'success',
// //         message: 'Token sent to email!',
// //       });
// //     } catch (err) {
// //       user.passwordResetToken = undefined;
// //       user.passwordResetExpires = undefined;
// //       await user.save({ validateBeforeSave: false });

// //       return res.status(500).json({
// //         status: 'error',
// //         message: 'There was an error sending the email. Try again later!',
// //         error: err.message // Added for debugging
// //       });
// //     }
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong',
// //       error: err.message // Added for debugging
// //     });
// //   }
// // };

// // // Get current user
// // exports.getMe = async (req, res, next) => {
// //   try {
// //     const user = await User.findById(req.user.id)
// //       .select('-password -passwordResetToken -passwordResetExpires');
    
// //     res.status(200).json({
// //       status: 'success',
// //       data: {
// //         user
// //       }
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };

// // // Reset password controller
// // exports.resetPassword = async (req, res, next) => {
// //   try {
// //     const hashedToken = crypto
// //       .createHash('sha256')
// //       .update(req.params.token)
// //       .digest('hex');

// //     const user = await User.findOne({
// //       passwordResetToken: hashedToken,
// //       passwordResetExpires: { $gt: Date.now() },
// //     });

// //     if (!user) {
// //       return res.status(400).json({
// //         status: 'fail',
// //         message: 'Token is invalid or has expired',
// //       });
// //     }

// //     user.password = req.body.password;
// //     user.passwordResetToken = undefined;
// //     user.passwordResetExpires = undefined;
// //     user.passwordChangedAt = Date.now();
// //     await user.save();

// //     createSendToken(user, 200, res);
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong',
// //       error: err.message,
// //     });
// //   }
// // };

// // // Update password controller
// // exports.updatePassword = async (req, res, next) => {
// //   try {
// //     const user = await User.findById(req.user.id).select('+password');

// //     if (!(await user.comparePassword(req.body.currentPassword))) {
// //       return res.status(401).json({
// //         status: 'fail',
// //         message: 'Your current password is wrong',
// //       });
// //     }

// //     user.password = req.body.newPassword;
// //     user.passwordChangedAt = Date.now();
// //     await user.save();

// //     createSendToken(user, 200, res);
// //   } catch (err) {
// //     res.status(500).json({
// //       status: 'error',
// //       message: 'Something went wrong',
// //       error: err,
// //     });
// //   }
// // };

// // // Refresh token controller
// // exports.refreshToken = async (req, res, next) => {
// //   try {
// //     const token = req.headers.authorization?.split(' ')[1];
// //     if (!token) {
// //       return res.status(401).json({
// //         status: 'fail',
// //         message: 'No token provided',
// //       });
// //     }

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// //     // Check if user still exists
// //     const currentUser = await User.findById(decoded.id);
// //     if (!currentUser) {
// //       return res.status(401).json({
// //         status: 'fail',
// //         message: 'The user belonging to this token no longer exists',
// //       });
// //     }

// //     // Check if user changed password after the token was issued
// //     if (currentUser.changedPasswordAfter(decoded.iat)) {
// //       return res.status(401).json({
// //         status: 'fail',
// //         message: 'User recently changed password! Please log in again',
// //       });
// //     }

// //     const newToken = signToken(decoded.id, decoded.role);
    
// //     res.status(200).json({
// //       status: 'success',
// //       token: newToken,
// //     });
// //   } catch (err) {
// //     res.status(401).json({
// //       status: 'fail',
// //       message: 'Invalid or expired token',
// //     });
// //   }
// // };



// const User = require('../db/userSchema');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const { sendOTPEmail } = require('../utils/otpService'); // Optional modularization

// // Create JWT
// const signToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// // Send token in response
// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id, user.role);
//   const cookieOptions = {
//     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   };

//   res.cookie('jwt', token, cookieOptions);
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: { user },
//   });
// };

// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ status: 'fail', message: 'Email and password are required.' });

//     const user = await User.findOne({ email }).select('+password');
//     if (!user || !(await user.comparePassword(password)))
//       return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });

//     if (!user.isApproved)
//       return res.status(403).json({ status: 'fail', message: 'Account not approved. Contact admin.' });

//     // Update last active timestamp
//     user.lastActive = Date.now();
//     await user.save({ validateBeforeSave: false });

//     console.log('User before token creation:', user); // Debug log
    
//     createSendToken(user, 200, res);
//   } catch (err) {
//     console.error('Login error:', err); // Debug log
//     res.status(500).json({ status: 'error', message: 'Server error' });
//   }
// };
// // exports.login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (!email || !password)
// //       return res.status(400).json({ status: 'fail', message: 'Email and password are required.' });

// //     const user = await User.findOne({ email }).select('+password');
// //     if (!user || !(await user.comparePassword(password)))
// //       return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });

// //     if (!user.isApproved)
// //       return res.status(403).json({ status: 'fail', message: 'Account not approved. Contact admin.' });

// //     user.lastActive = Date.now();
// //     await user.save({ validateBeforeSave: false });

// //     createSendToken(user, 200, res);
// //   } catch (err) {
// //     res.status(500).json({ status: 'error', message: 'Server error' });
// //   }
// // };

// exports.checkEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (user) {
//     return res.status(200).json({ status: 'success', exists: true });
//   } else {
//     return res.status(404).json({ status: 'fail', exists: false });
//   }
// };



// // SEND OTP
// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user)
//       return res.status(404).json({ status: 'fail', message: 'User not found with that email.' });

//     const otp = user.createOTP();
//     await user.save({ validateBeforeSave: false });

//     try {
//       await sendOTPEmail(email, otp); // or replace with inline EmailJS code
//       res.status(200).json({ status: 'success', message: 'OTP sent to email' });
//     } catch {
//       user.clearOTP();
//       await user.save({ validateBeforeSave: false });
//       res.status(500).json({ status: 'error', message: 'Failed to send OTP email' });
//     }
//   } catch {
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// };

// // VERIFY OTP + RESET PASSWORD
// exports.verifyOTPAndResetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     const user = await User.findOne({ email }).select('+passwordResetOTP +password');
//     if (!user)
//       return res.status(404).json({ status: 'fail', message: 'No user found with that email.' });

//     if (!user.verifyOTP(otp))
//       return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP.' });

//     user.password = newPassword;
//     user.passwordChangedAt = Date.now();
//     user.clearOTP();
//     await user.save();

//     res.status(200).json({ status: 'success', message: 'Password reset successfully.' });
//   } catch {
//     res.status(500).json({ status: 'error', message: 'Failed to reset password' });
//   }
// };

// // GET ME
// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password -passwordResetToken -passwordResetExpires');
//     res.status(200).json({ status: 'success', user });

//   } catch {
//     res.status(500).json({ status: 'error', message: 'Failed to retrieve user' });
//   }
// };

// // UPDATE PASSWORD (protected)
// exports.updatePassword = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('+password');
//     if (!(await user.comparePassword(req.body.currentPassword)))
//       return res.status(401).json({ status: 'fail', message: 'Current password is incorrect.' });

//     user.password = req.body.newPassword;
//     user.passwordChangedAt = Date.now();
//     await user.save();

//     createSendToken(user, 200, res);
//   } catch {
//     res.status(500).json({ status: 'error', message: 'Failed to update password' });
//   }
// };

// // REFRESH TOKEN
// exports.refreshToken = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token)
//       return res.status(401).json({ status: 'fail', message: 'Token missing' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user)
//       return res.status(401).json({ status: 'fail', message: 'User does not exist' });

//     if (user.changedPasswordAfter(decoded.iat))
//       return res.status(401).json({ status: 'fail', message: 'Password changed after login. Re-login required.' });

//     const newToken = signToken(user.id, user.role);
//     res.status(200).json({ status: 'success', token: newToken });
//   } catch {
//     res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
//   }
// };
// // Add this to auth-controller.js
// // auth-controller.js
// exports.updateMe = async (req, res) => {
//   try {
//     // Filter out fields that shouldn't be updated
//     const filteredBody = { ...req.body };
//     const excludedFields = ['password', 'role', 'isApproved', 'createdBy'];
//     excludedFields.forEach(field => delete filteredBody[field]);
    
//     // Convert string dates to Date objects if needed
//     if (filteredBody.dateOfBirth) {
//       filteredBody.dateOfBirth = new Date(filteredBody.dateOfBirth);
//     }
//     if (filteredBody.affiliation?.joiningDate) {
//       filteredBody.affiliation.joiningDate = new Date(filteredBody.affiliation.joiningDate);
//     }
    
//     // Handle profile image separately if needed
//     if (req.file) {
//       filteredBody.profileImage = req.file.path;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       filteredBody,
//       { 
//         new: true,
//         runValidators: true
//       }
//     ).select('-password -passwordResetToken -passwordResetExpires -passwordResetOTP -otpExpires');

//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: updatedUser
//       }
//     });
//   } catch (err) {
//     console.error('Error updating user:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message || 'Failed to update profile'
//     });
//   }
// };
// // exports.updateMe = async (req, res) => {
// //   try {
// //     // Filter out unwanted fields that shouldn't be updated
// //     const filteredBody = { ...req.body };
// //     delete filteredBody.password;
// //     delete filteredBody.role;
// //     delete filteredBody.isApproved;

// //     const updatedUser = await User.findByIdAndUpdate(
// //       req.user.id,
// //       filteredBody,
// //       { new: true, runValidators: true }
// //     ).select('-password -passwordResetToken -passwordResetExpires');

// //     res.status(200).json({
// //       status: 'success',
// //       data: { user: updatedUser }
// //     });
// //   } catch (err) {
// //     res.status(400).json({
// //       status: 'fail',
// //       message: err.message
// //     });
// //   }
// // };