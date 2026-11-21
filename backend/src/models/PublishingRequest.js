const mongoose = require('mongoose');

const publishingRequestSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Manuscript title is required'],
      trim: true,
    },
    genre: {
      type: String,
      required: true,
    },
    packageSelected: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublishingPackage',
      required: false,
    },
    manuscriptFileUrl: {
      type: String,
      default: '',
    },
    sampleChapterUrl: {
      type: String,
      default: '',
    },
    abstract: {
      type: String,
      required: [true, 'Brief abstract or synopsis is required'],
    },
    targetWordCount: {
      type: Number,
      default: 50000,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'under_review', 'revision_required', 'accepted', 'approved', 'rejected', 'publishing', 'published', 'contract_sent'],
      default: 'submitted',
    },
    editorialFeedback: {
      type: String,
      default: '',
    },
    assignedEditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PublishingRequest', publishingRequestSchema);
