import mongoose from'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// User Model
const userSchema = new mongoose.Schema({
  cnic: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{13}$/.test(v);
      },
      message: 'CNIC must be 13 digits'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate authentication token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      _id: this._id, 
      email: this.email, 
      role: this.role 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
};



module.exports = { User: mongoose.model('User', userSchema) };