const express = require('express');
const router = express.Router();
const {
  addReview,
  getBookReviews,
  getWishlist,
  toggleWishlist,
} = require('../controllers/reviewWishlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/reviews', protect, addReview);
router.get('/reviews/book/:bookId', getBookReviews);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);

module.exports = router;
