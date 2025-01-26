import mongoose from'mongoose';
import { Guarantor } from '../controllers/appointmentController';

// Guarantor Schema
const guarantorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  cnic: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{13}$/.test(v);
      },
      message: 'CNIC must be 13 digits'
    }
  },
  location: {
    type: String,
    required: true
  },
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  }
}, { timestamps: true });

module.exports = { Guarantor: mongoose.model('Guarantor', guarantorSchema) };