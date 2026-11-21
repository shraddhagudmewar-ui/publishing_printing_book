const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// @desc    Add review for a book
// @route   POST /api/reviews
// @access  Private (Customer or Author)
exports.addReview = async (req, res, next) => {
  try {
    const { bookId, rating, title, comment } = req.body;

    const existing = await Review.findOne({ user: req.user.id, book: bookId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this publication.' });
    }

    const review = await Review.create({
      user: req.user.id,
      userName: req.user.name,
      book: bookId,
      rating,
      title,
      comment,
      isVerifiedPurchase: true,
    });

    // Update book average rating
    const reviews = await Review.find({ book: bookId });
    const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await Book.findByIdAndUpdate(bookId, {
      ratingAverage: Number(avg.toFixed(1)),
      totalReviews: reviews.length,
    });

    res.status(201).json({ success: true, message: 'Review recorded', data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
exports.getBookReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('books');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, books: [] });
    }
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle book in wishlist (add if not present, remove if present)
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, books: [bookId] });
      return res.status(200).json({ success: true, message: 'Added to curated wishlist', inWishlist: true });
    }

    const index = wishlist.books.indexOf(bookId);
    let inWishlist = false;

    if (index > -1) {
      wishlist.books.splice(index, 1);
      inWishlist = false;
    } else {
      wishlist.books.push(bookId);
      inWishlist = true;
    }

    await wishlist.save();
    res.status(200).json({
      success: true,
      message: inWishlist ? 'Saved to reading wishlist' : 'Removed from wishlist',
      inWishlist,
    });
  } catch (error) {
    next(error);
  }
};
