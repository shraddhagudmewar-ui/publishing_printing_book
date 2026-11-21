const express = require('express');
const router = express.Router();
const PublishingPackage = require('../models/PublishingPackage');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/packages (Public)
router.get('/', async (req, res, next) => {
  try {
    const packages = await PublishingPackage.find().sort({ price: 1 });
    res.status(200).json({ success: true, count: packages.length, packages });
  } catch (err) {
    next(err);
  }
});

// Admin Protected Package CRUD
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { name, tier, price, features, royaltyPercentage, complimentaryCopies } = req.body;
    const pkg = await PublishingPackage.create({
      name,
      tier: tier || 'Standard',
      price,
      features: Array.isArray(features) ? features : (features || '').split('\n').filter(Boolean),
      royaltyPercentage: royaltyPercentage || 100,
      complimentaryCopies: complimentaryCopies || 10,
    });
    res.status(201).json({ success: true, package: pkg });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { name, tier, price, features, royaltyPercentage, complimentaryCopies, isActive } = req.body;
    const pkg = await PublishingPackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    if (name) pkg.name = name;
    if (tier) pkg.tier = tier;
    if (typeof price !== 'undefined') pkg.price = price;
    if (features) pkg.features = Array.isArray(features) ? features : features.split('\n').filter(Boolean);
    if (typeof royaltyPercentage !== 'undefined') pkg.royaltyPercentage = royaltyPercentage;
    if (typeof complimentaryCopies !== 'undefined') pkg.complimentaryCopies = complimentaryCopies;
    if (typeof isActive !== 'undefined') pkg.isActive = isActive;

    await pkg.save();
    res.status(200).json({ success: true, package: pkg });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await PublishingPackage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
