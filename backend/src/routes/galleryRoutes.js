const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/gallery
// @desc    Get all gallery photos (Public)
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: photos.length, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/gallery
// @desc    Add a photo to gallery (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, imageUrl, caption, category } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required' });
    }

    const photo = await Gallery.create({
      title,
      imageUrl,
      caption: caption || '',
      category: category || 'Events & Releases',
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Photo added to gallery', data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery photo (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Photo removed from gallery' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
