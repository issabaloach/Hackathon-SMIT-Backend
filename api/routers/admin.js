import express from "express"
import adminController from "../controllers/adminController.js"
import AuthMiddleware from "../middleware/authentication.js"
import validateInput from "../middleware/validation.js"
import Joi from "joi"

const Adminrouter = express.Router()

// Update Loan Status Validation Schema
const updateLoanStatusSchema = Joi.object({
  status: Joi.string().valid("APPROVED", "REJECTED", "IN_REVIEW").required(),
  comments: Joi.string().optional().max(500),
})

// Filter Applications Validation Schema
const filterApplicationsSchema = Joi.object({
  city: Joi.string().optional(),
  status: Joi.string().optional(),
  category: Joi.string().optional(),
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(10),
})

// Get All Loan Applications
Adminrouter.get(
  "/applications",
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  adminController.getAllApplications,
)

// Filter Loan Applications
Adminrouter.post(
  "/applications/filter",
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  validateInput(filterApplicationsSchema),
  adminController.filterApplications,
)

// Update Loan Application Status
Adminrouter.put(
  "/applications/:id/status",
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  validateInput(updateLoanStatusSchema),
  adminController.updateLoanStatus,
)

// Generate Application Token
Adminrouter.post(
  "/applications/:id/token",
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  adminController.generateApplicationToken,
)

// Dashboard Statistics
Adminrouter.get(
  "/dashboard",
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  adminController.getDashboardStatistics,
)

export default Adminrouter

