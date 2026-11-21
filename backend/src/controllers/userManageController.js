const User = require('../models/User');
const Author = require('../models/Author');

// @desc Get all users or filtered by role
// @route GET /api/users
// @access Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user status or details
// @route PUT /api/users/:id
// @access Private (Admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive, phoneNumber } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    res.status(200).json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    next(error);
  }
};
