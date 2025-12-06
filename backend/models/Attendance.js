import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'holiday'],
    default: 'present'
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  mealType: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ member: 1, date: 1 }, { unique: true });
attendanceSchema.index({ month: 1, year: 1 });

export default mongoose.model('Attendance', attendanceSchema);
