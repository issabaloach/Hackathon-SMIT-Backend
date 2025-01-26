import express from 'express'
const router = express.Router();
import adminController from'../controllers/adminController';
import authMiddleware  from'../middleware/authMiddleware';
import joi from 'joi'

// Update Loan Status Validation Schema
const updateLoanStatusSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED', 'IN_REVIEW').required(),
  comments: Joi.string().optional()
});

// Filter Applications Validation Schema
const filterApplicationsSchema = Joi.object({
  city: Joi.string().optional(),
  status: Joi.string().optional(),
  category: Joi.string().optional()
});

// Get All Loan Applications
router.get('/applications', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  adminController.getAllApplications
);

// Filter Loan Applications
router.post('/applications/filter', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  authMiddleware.validateInput(filterApplicationsSchema),
  adminController.filterApplications
);

// Update Loan Application Status
router.put('/applications/:id/status', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  authMiddleware.validateInput(updateLoanStatusSchema),
  adminController.updateLoanStatus
);

// Generate Application Token
router.post('/applications/:id/token', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  adminController.generateApplicationToken
);

// Dashboard Statistics
router.get('/dashboard', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  adminController.getDashboardStatistics
);

module.exports = router;