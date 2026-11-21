const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verifies JWT from Authorization header
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please provide a valid Bearer token.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'ka_publications_super_secret_jwt_key_2026_dev_secure'
    );

    // Fetch user without password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact publisher support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token has expired.',
      error: error.message,
    });
  }
};

// Grant access to specific roles only
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role [${req.user ? req.user.role : 'none'}] is not permitted to perform this action.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
