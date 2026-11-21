const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/addresses
router.get('/', async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: addresses.length, addresses });
  } catch (err) {
    next(err);
  }
});

// POST /api/addresses
router.post('/', async (req, res, next) => {
  try {
    const { fullName, phone, streetAddress, city, state, postalCode, country, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const address = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      streetAddress,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: !!isDefault,
    });
    res.status(201).json({ success: true, address });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/addresses/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
