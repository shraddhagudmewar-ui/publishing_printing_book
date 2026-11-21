const Cart = require('../models/Cart');
const Book = require('../models/Book');

// @desc    Get user's active cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }
    res.status(200).json({ success: true, data: cart, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart or POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity = 1, format = 'Paperback', price, setExactQuantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }

    const bookDoc = await Book.findById(bookId);
    if (!bookDoc) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const itemPrice = Number(price) > 0 ? Number(price) : (Number(bookDoc.price) || 299);

    const itemIndex = cart.items.findIndex((item) => {
      const itBookId = item.book?._id ? item.book._id.toString() : (item.book ? item.book.toString() : '');
      const matchBook = itBookId === bookId.toString();
      const matchFormat = String(item.format || '').toLowerCase() === String(format || '').toLowerCase();
      return matchBook && matchFormat;
    });

    if (itemIndex > -1) {
      if (setExactQuantity) {
        cart.items[itemIndex].quantity = Number(quantity);
      } else {
        cart.items[itemIndex].quantity += Number(quantity);
      }
      cart.items[itemIndex].price = itemPrice;
    } else {
      cart.items.push({
        book: bookDoc._id,
        quantity: Number(quantity) || 1,
        format: format || 'Paperback',
        price: itemPrice,
      });
    }

    // Filter out any corrupted items and recalculate
    cart.items = cart.items.filter((item) => item && item.book);
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)),
      0
    );

    await cart.save();
    await cart.populate('items.book');

    res.status(200).json({ success: true, message: 'Added to cart', data: cart, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((item) => {
      const itId = item._id ? item._id.toString() : '';
      const bkId = item.book?._id ? item.book._id.toString() : (item.book ? item.book.toString() : '');
      return itId !== itemId && bkId !== itemId;
    });

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)),
      0
    );
    await cart.save();
    await cart.populate('items.book');

    res.status(200).json({ success: true, message: 'Item removed from cart', data: cart, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart or DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalAmount: 0 },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Cart emptied', data: cart, cart });
  } catch (error) {
    next(error);
  }
};
