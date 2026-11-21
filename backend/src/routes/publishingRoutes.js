const express = require('express');
const router = express.Router();
const {
  createPublishingRequest,
  getPublishingRequests,
  reviewPublishingRequest,
} = require('../controllers/publishingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createPublishingRequest);
router.get('/', protect, getPublishingRequests);
router.put('/:id/review', protect, authorize('admin'), reviewPublishingRequest);

module.exports = router;
