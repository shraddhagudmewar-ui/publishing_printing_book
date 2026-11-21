const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cover') {
      cb(null, path.join(__dirname, '../../uploads/covers'));
    } else {
      cb(null, path.join(__dirname, '../../uploads/manuscripts'));
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filters
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'cover') {
    // Images: jpg, jpeg, png, webp
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    return cb(new Error('Only image files (jpeg, jpg, png, webp) are permitted for book covers.'));
  } else {
    // Manuscripts: pdf, doc, docx, txt
    const allowed = /pdf|doc|docx|txt/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) {
      return cb(null, true);
    }
    return cb(new Error('Only document files (pdf, doc, docx, txt) are permitted for manuscripts.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: fileFilter,
});

// POST /api/upload/manuscript
router.post('/manuscript', protect, upload.single('manuscript'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a manuscript file' });
  }
  const fileUrl = `/uploads/manuscripts/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'Manuscript uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    url: fileUrl,
  });
});

// POST /api/upload/cover
router.post('/cover', protect, upload.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a book cover file' });
  }
  const fileUrl = `/uploads/covers/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'Book cover uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    url: fileUrl,
  });
});

module.exports = router;
