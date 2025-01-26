import mongoose from "mongoose";

const guarantorSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true
  },
  relationship: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Guarantor', guarantorSchema);