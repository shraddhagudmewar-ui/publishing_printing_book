const mongoose = require('mongoose');

const printingRequestSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: false,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity of copies required'],
      min: [5, 'Minimum 5 copies for custom print run'],
    },
    paperQuality: {
      type: String,
      enum: ['70 GSM Natural Shade', '80 GSM Royal Bond', '100 GSM Archival Cream'],
      default: '70 GSM Natural Shade',
    },
    coverFinish: {
      type: String,
      enum: ['Matte Velvet with Gold Foil', 'Gloss Laminated', 'Hardcover Cloth Bound'],
      default: 'Matte Velvet with Gold Foil',
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    estimatedCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'in_progress', 'completed', 'quality_check', 'proof_approved', 'in_printing', 'dispatched', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

printingRequestSchema.add({
  pdfUrl: { type: String, required: false }
});
module.exports = mongoose.model('PrintingRequest', printingRequestSchema);
