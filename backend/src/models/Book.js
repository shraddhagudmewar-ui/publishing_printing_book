const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    genre: {
      type: String,
      required: true,
      default: 'General Literature',
    },
    description: {
      type: String,
      required: [true, 'Book description or synopsis is required'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 50,
      min: 0,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    },
    samplePdfUrl: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      enum: ['Paperback', 'Hardcover', 'Digital Monograph', 'Collector Boxset'],
      default: 'Paperback',
    },
    status: {
      type: String,
      enum: ['draft', 'under_review', 'approved', 'published', 'archived'],
      default: 'published',
    },
    pages: {
      type: Number,
      default: 200,
    },
    language: {
      type: String,
      default: 'English',
    },
    publisher: {
      type: String,
      default: 'KA Group of Publications',
    },
    ratingAverage: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewRelease: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
