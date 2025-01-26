import mongoose from "mongoose";
const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: Number,
    required: true,
    min: 1
  },
  initialDeposit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Disbursed'],
    default: 'Pending'
  },
  guarantors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guarantor'
  }],
  documents: [{
    type: String  // URLs or file paths to uploaded documents
  }],
  monthlyPayment: {
    type: Number
  },
  totalPayment: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default  mongoose.model('Loan', loanSchema);