const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/payments
router.get('/', async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    const payments = await Payment.find(query)
      .populate('order', 'orderNumber totalAmount orderStatus')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/razorpay-init (Initiate test payment / order)
router.post('/razorpay-init', async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const razorpayOrderId = 'order_test_' + Date.now() + Math.random().toString(36).substring(2, 7);

    res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_KA_PUBLICATIONS_DEMO',
      razorpayOrderId,
      amount: amount * 100, // paise
      currency: 'INR',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/verify (Verify test payment and mark Order/Payment completed)
router.post('/verify', async (req, res, next) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Mark order as paid and confirmed
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    await order.save();

    // Create Payment Record
    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      paymentId: razorpayPaymentId || 'PAY_' + Date.now(),
      amount: order.totalAmount,
      currency: 'INR',
      paymentMethod: 'UPI',
      status: 'completed',
      transactionReceipt: razorpayOrderId || 'REC_' + Date.now(),
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and Order confirmed!',
      order,
      payment,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/payments/:id/refund (Admin only)
router.put('/:id/refund', authorize('admin'), async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    payment.status = 'refunded';
    await payment.save();

    // If order attached, update order status
    if (payment.order) {
      await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'refunded', orderStatus: 'cancelled' });
    }

    res.status(200).json({ success: true, message: 'Payment refunded successfully', payment });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
