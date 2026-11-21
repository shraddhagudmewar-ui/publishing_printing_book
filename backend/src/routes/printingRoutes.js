const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const {
  createPrintingRequest,
  getPrintingRequests,
  updatePrintingStatus,
} = require('../controllers/printingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Storage config for PDF book printing uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/manuscripts'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.pdf';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'print-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Routes
router.post('/', protect, upload.single('pdf'), createPrintingRequest);
router.get('/', protect, getPrintingRequests);
router.put('/:id/status', protect, authorize('admin'), updatePrintingStatus);

module.exports = router;
