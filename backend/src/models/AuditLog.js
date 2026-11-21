const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. "APPROVE_MANUSCRIPT", "CREATE_BOOK", "UPDATE_ORDER_STATUS"
    },
    entityType: {
      type: String, // e.g. "PublishingRequest", "Book", "Order", "User"
      required: true,
    },
    entityId: {
      type: String,
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
