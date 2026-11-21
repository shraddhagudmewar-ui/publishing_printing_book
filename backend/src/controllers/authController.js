const crypto = require('crypto');
const User = require('../models/User');
const Author = require('../models/Author');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const jwt = require('jsonwebtoken');

// Helper to generate signed JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'ka_publications_super_secret_jwt_key_2026_dev_secure',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      token,
    },
  });
};

// @desc    Register a new customer or author
// @route   POST /api/auth/register
// @access  Public (Admin role strictly prohibited here)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    // All public registrations are Customers only
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'customer',
      phoneNumber: phoneNumber || '',
      bio: bio || '',
    });

    // Auto initialize Cart & Wishlist
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, books: [] });

    sendTokenResponse(user, 201, res, 'Customer account successfully registered and authenticated.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    // Check for user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged-in User Profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let extraData = {};

    if (user.role === 'author') {
      extraData.authorProfile = await Author.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        ...extraData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Profile details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      bio: req.body.bio,
      avatar: req.body.avatar,
    };

    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile details updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Generates reset token
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email in our publication records.',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In production send an email; here we return the simulation token
    res.status(200).json({
      success: true,
      message: 'Password reset token generated. In production, this link is emailed.',
      resetToken,
      resetUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/resetpassword/${resetToken}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with token
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Hash token from parameter
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password has been reset successfully.');
  } catch (error) {
    next(error);
  }
};
