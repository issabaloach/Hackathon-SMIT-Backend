import express from "express";
const router = express.Router();
import loanController from "../controllers/loanController.js";
import authMiddleware from "../middleware/authentication.js";
import Joi from "joi";

// Loan Calculation Validation Schema
const loanCalculationSchema = Joi.object({
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  amount: Joi.number().positive().required(),
  period: Joi.number().min(1).max(5).required(),
  initialDeposit: Joi.number().positive().required(),
});

// Loan Request Validation Schema
const loanRequestSchema = Joi.object({
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  amount: Joi.number().positive().required(),
  period: Joi.number().min(1).max(5).required(),
  initialDeposit: Joi.number().positive().required(),
  guarantors: Joi.array().items(Joi.string()).optional(),
  documents: Joi.array().items(Joi.string()).optional(),
});

// Get Loan Categories
router.get(
  "/categories",
  authMiddleware.verifyToken,
  loanController.getLoanCategories
);

// Calculate Loan Details
router.post(
  "/calculate",
  authMiddleware.verifyToken,
  authMiddleware.validateInput(loanCalculationSchema),
  loanController.calculateLoan
);

// Submit Loan Request
router.post(
  "/request",
  authMiddleware.verifyToken,
  authMiddleware.validateInput(loanRequestSchema),
  loanController.submitLoanRequest
);

// Get User's Loan Requests
router.get(
  "/my-requests",
  authMiddleware.verifyToken,
  loanController.getUserLoanRequests
);

// Get Specific Loan Request Details
router.get(
  "/request/:id",
  authMiddleware.verifyToken,
  loanController.getLoanRequestDetails
);

module.exports = router;
