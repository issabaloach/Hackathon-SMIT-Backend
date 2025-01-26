// loanValidationSchema.js
import Joi from 'joi';

// Loan Validation Schema
const loanValidationSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.base': 'Loan amount must be a number.',
    'number.positive': 'Loan amount must be positive.',
    'any.required': 'Loan amount is required.',
  }),
  term: Joi.number().positive().required().messages({
    'number.base': 'Loan term must be a number.',
    'number.positive': 'Loan term must be positive.',
    'any.required': 'Loan term is required.',
  }),
});

export default loanValidationSchema