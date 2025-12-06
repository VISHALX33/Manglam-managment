import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  foodTime: {
    type: String,
    enum: ['1 time', '2 times', '3 times'],
    required: [true, 'Food time is required']
  },
  paymentPlan: {
    type: String,
    enum: ['monthly', '15days', 'nasta', 'custom'],
    required: [true, 'Payment plan is required']
  },
  planAmount: {
    type: Number,
    required: [true, 'Plan amount is required']
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastPaymentDate: {
    type: Date
  },
  nextPaymentDue: {
    type: Date
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate next payment due based on plan
memberSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('paymentPlan')) {
    const today = new Date();
    if (this.paymentPlan === 'monthly') {
      this.nextPaymentDue = new Date(today.setMonth(today.getMonth() + 1));
    } else if (this.paymentPlan === '15days') {
      this.nextPaymentDue = new Date(today.setDate(today.getDate() + 15));
    } else if (this.paymentPlan === 'nasta') {
      this.nextPaymentDue = new Date(today.setMonth(today.getMonth() + 1));
    }
  }
  next();
});

export default mongoose.model('Member', memberSchema);
