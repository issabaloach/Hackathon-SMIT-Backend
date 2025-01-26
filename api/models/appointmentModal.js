import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const appointmentSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenNumber: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  officeLocation: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Rescheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  rescheduleReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.plugin(mongoosePaginate);

export default mongoose.model('Appointment', appointmentSchema);