import mongoose from 'mongoose';
import Joi from 'joi';

// Mongoose Schema (used for data structure in MongoDB)
const registerSchema = new mongoose.Schema({
  cnic: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{13}$/  // Use regex for CNIC validation directly in mongoose
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  password: {  // Added password field
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Mongoose Model
const Register = mongoose.models.Register || mongoose.model('Register', registerSchema);

export const validateRegister = (data) => {
  const registerValidationSchema = Joi.object({
    cnic: Joi.string()
      .pattern(/^\d{13}$/)
      .required()
      .messages({
        'string.pattern.base': 'CNIC must be exactly 13 digits.',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Invalid email format.',
      }),
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters.',
        'string.max': 'Name must not exceed 50 characters.',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters.',
      }),
  });

  return registerValidationSchema.validate(data);
};

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

export default Register;