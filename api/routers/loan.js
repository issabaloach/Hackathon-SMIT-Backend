// Loanrouter.js
import express from 'express';
import AuthMiddleware from '../middleware/authentication.js';
import loanController from '../controllers/loanController.js';
import loanValidationSchema from '../validation/loanValidationSchema.js'; // Import validation schema

const Loanrouter = express.Router();

// Public Route: Calculate loan details
Loanrouter.post(
  '/calculate',
  AuthMiddleware.validateInput(loanValidationSchema), // Validate input
  loanController.calculateLoan
);

// Public Route: Get loan categories
Loanrouter.get(
  '/categories',
  loanController.getLoanCategories
);

// Authenticated Route: Submit loan request
Loanrouter.post(
  '/submit',
  AuthMiddleware.verifyToken, // Verify JWT token
  AuthMiddleware.validateInput(loanValidationSchema), // Validate input
  loanController.submitLoanRequest
);

// Authenticated Route: Get user's loans
Loanrouter.get(
  '/my-loans',
  AuthMiddleware.verifyToken, // Verify JWT token
  loanController.getUserLoans
);

// Admin-Only Route: Update loan status
Loanrouter.patch(
  '/:loanId/status',
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  loanController.updateLoanStatus 
);


export default Loanrouter;
