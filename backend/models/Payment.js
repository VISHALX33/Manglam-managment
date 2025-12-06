import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer'],
    default: 'cash'
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

paymentSchema.index({ member: 1, paymentDate: -1 });

export default mongoose.model('Payment', paymentSchema);
