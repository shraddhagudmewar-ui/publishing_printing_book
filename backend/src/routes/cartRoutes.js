const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Get active cart
router.get('/', protect, getCart);

// Support both POST /api/cart and POST /api/cart/add
router.post('/', protect, addToCart);
router.post('/add', protect, addToCart);

// Support both DELETE /api/cart/:itemId and DELETE /api/cart/item/:itemId
router.delete('/:itemId', protect, removeFromCart);
router.delete('/item/:itemId', protect, removeFromCart);

// Support both DELETE /api/cart and DELETE /api/cart/clear
router.delete('/', protect, clearCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
