const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authorRoutes = require('./routes/authorRoutes');
const packageRoutes = require('./routes/packageRoutes');
const publishingRoutes = require('./routes/publishingRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewWishlistRoutes = require('./routes/reviewWishlistRoutes');
const printingRoutes = require('./routes/printingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userManageRoutes = require('./routes/userManageRoutes');
const addressRoutes = require('./routes/addressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB Compass (ka_publications)
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Serve static uploaded files (Covers, samples)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to KA Group of Publications API',
    health: '/api/health'
  });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    application: 'KA Group of Publications API',
    tagline: 'Where Words Become Legacy.',
    database: 'ka_publications',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/publishing', publishingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', reviewWishlistRoutes);
app.use('/api/printing', printingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userManageRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` KA Group of Publications API running on port ${PORT}`);
  console.log(` Database Target: mongodb://127.0.0.1:27017/ka_publications`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
