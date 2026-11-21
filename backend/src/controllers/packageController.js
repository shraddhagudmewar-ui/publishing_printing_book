const PublishingPackage = require('../models/PublishingPackage');

exports.getPackages = async (req, res, next) => {
  try {
    const packages = await PublishingPackage.find({ isActive: true }).sort({ price: 1 });
    res.status(200).json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    next(error);
  }
};
