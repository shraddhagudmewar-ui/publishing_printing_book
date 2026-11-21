const Author = require('../models/Author');
const User = require('../models/User');

exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find()
      .populate('user', 'name email avatar bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: authors.length,
      data: authors,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id).populate('user', 'name email avatar bio');
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author record not found' });
    }
    res.status(200).json({ success: true, data: author });
  } catch (error) {
    next(error);
  }
};
