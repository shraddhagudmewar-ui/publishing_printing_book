const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer or Author)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'UPI' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one book.' });
    }

    const normalizedItems = items.map(item => ({
      book: item.book?._id || item.book || item._id,
      title: item.title || item.book?.title || 'Publication Book',
      quantity: Number(item.quantity || 1),
      price: Number(item.price || item.book?.price || 0),
      format: item.format || 'paperback',
    }));

    const subTotal = normalizedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingFee = subTotal > 500 || subTotal === 0 ? 0 : 50;
    const totalAmount = subTotal + shippingFee;
    const orderNumber = `KA-ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const normalizedShipping = {
      fullName: shippingAddress?.fullName || shippingAddress?.name || req.user.name || 'Valued Customer',
      phone: shippingAddress?.phone || req.user.phoneNumber || '9999999999',
      streetAddress: shippingAddress?.streetAddress || shippingAddress?.street || shippingAddress?.address || 'Standard Address',
      city: shippingAddress?.city || 'City',
      state: shippingAddress?.state || 'State',
      postalCode: shippingAddress?.postalCode || shippingAddress?.pincode || '400001',
      country: shippingAddress?.country || 'India',
    };

    let normalizedMethod = 'UPI';
    const methodStr = String(paymentMethod || '').toLowerCase();
    if (methodStr.includes('cod') || methodStr.includes('cash')) {
      normalizedMethod = 'Cash on Delivery';
    } else if (methodStr.includes('card') || methodStr.includes('credit') || methodStr.includes('debit')) {
      normalizedMethod = 'Credit/Debit Card';
    } else if (methodStr.includes('net') || methodStr.includes('bank')) {
      normalizedMethod = 'Net Banking';
    } else if (methodStr.includes('upi') || methodStr.includes('qr')) {
      normalizedMethod = 'UPI';
    } else {
      normalizedMethod = 'Simulation Sandbox';
    }

    const isCod = normalizedMethod === 'Cash on Delivery';
    const paymentStatus = isCod ? 'pending' : 'paid';

    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      items: normalizedItems,
      shippingAddress: normalizedShipping,
      subTotal,
      shippingFee,
      totalAmount,
      paymentStatus,
      orderStatus: isCod ? 'confirmed' : 'processing',
    });

    // Create payment ledger record
    await Payment.create({
      order: order._id,
      user: req.user.id,
      paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: totalAmount,
      currency: 'INR',
      paymentMethod: normalizedMethod,
      status: isCod ? 'pending' : 'completed',
    });

    // Clear user's active cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalAmount: 0 });

    // Send confirmation notification
    await Notification.create({
      recipient: req.user.id,
      title: `Order #${orderNumber} Confirmed`,
      message: `Your acquisition of ${normalizedItems.length} title(s) totaling ₹${totalAmount} has been registered (${isCod ? 'Pay on Delivery' : 'Paid via ' + paymentMethod}).`,
      type: 'order_update',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders (Customer sees own, Admin sees all)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = orderStatus || order.orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    await Notification.create({
      recipient: order.user,
      title: `Order Update #${order.orderNumber}`,
      message: `Your shipment status is now: [${order.orderStatus.toUpperCase()}]. Tracking: ${order.trackingNumber || 'Available shortly'}`,
      type: 'order_update',
    });

    res.status(200).json({ success: true, message: 'Order updated', data: order });
  } catch (error) {
    next(error);
  }
};
