import mongoose from'mongoose';

// Loan Categories Configuration
const LOAN_CATEGORIES = {
  WEDDING: {
    subcategories: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
    maxAmount: 500000, // PKR 5 Lakh
    maxPeriod: 3 // years
  },
  HOME_CONSTRUCTION: {
    subcategories: ['Structure', 'Finishing', 'Loan'],
    maxAmount: 1000000, // PKR 10 Lakh
    maxPeriod: 5 // years
  },
  BUSINESS_STARTUP: {
    subcategories: ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
    maxAmount: 1000000, // PKR 10 Lakh
    maxPeriod: 5 // years
  },
  EDUCATION: {
    subcategories: ['University Fees', 'Child Fees Loan'],
    maxAmount: null, // Based on requirement
    maxPeriod: 4 // years
  }
};

// Loan Schema
const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: Object.keys(LOAN_CATEGORIES),
    required: true
  },
  subcategory: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return LOAN_CATEGORIES[this.category].subcategories.includes(v);
      },
      message: 'Invalid subcategory for selected category'
    }
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        const categoryConfig = LOAN_CATEGORIES[this.category];
        return categoryConfig.maxAmount === null || v <= categoryConfig.maxAmount;
      },
      message: 'Loan amount exceeds maximum limit'
    }
  },
  period: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        const categoryConfig = LOAN_CATEGORIES[this.category];
        return v <= categoryConfig.maxPeriod;
      },
      message: 'Loan period exceeds maximum allowed'
    }
  },
  initialDeposit: {
    type: Number,
    required: true
  },
  guarantors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'IN_REVIEW'],
    default: 'PENDING'
  },
  documents: [{
    type: String, // URL or file path
    description: String
  }]
}, { timestamps: true });

module.exports = { Loan: mongoose.model('Loan', loanSchema) };