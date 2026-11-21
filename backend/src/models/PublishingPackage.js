const mongoose = require('mongoose');

const publishingPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tier: {
      type: String,
      enum: ['Standard', 'Silver', 'Gold', 'Patron Archive'],
      default: 'Standard',
    },
    price: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    royaltyPercentage: {
      type: Number,
      default: 100, // 100% Author royalty retention
    },
    isbnProvided: {
      type: Boolean,
      default: true,
    },
    complimentaryCopies: {
      type: Number,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PublishingPackage', publishingPackageSchema);
