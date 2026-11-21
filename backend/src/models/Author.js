const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    penName: {
      type: String,
      required: [true, 'Pen name or display name is required'],
      trim: true,
    },
    genres: [
      {
        type: String,
      },
    ],
    biography: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    totalPublishedBooks: {
      type: Number,
      default: 0,
    },
    totalRoyaltiesAccrued: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Author', authorSchema);
