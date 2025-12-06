import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    enum: ['member', 'attendance', 'payment', 'system'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export default mongoose.model('ActivityLog', activityLogSchema);
