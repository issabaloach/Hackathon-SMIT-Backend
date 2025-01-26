import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authentication.js";
import Joi from "joi";

// User Registration Validation Schema
const registerSchema = Joi.object({
  cnic: Joi.string()
    .pattern(/^\d{13}$/)
    .required(),
  email: Joi.string().email().required(),
  name: Joi.string().trim().min(2).max(50).required(),
});

// Login Validation Schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Change Password Validation Schema
const changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, include letters, numbers, and special characters",
    }),
});

// User Registration Route
router.post(
  "/register",
  authMiddleware.validateInput(registerSchema),
  authController.register
);

// User Login Route
router.post(
  "/login",
  authMiddleware.validateInput(loginSchema),
  authController.login
);

// Change Password Route
router.post(
  "/change-password",
  authMiddleware.verifyToken,
  authMiddleware.validateInput(changePasswordSchema),
  authController.changePassword
);

// Get User Profile
router.get(
  "/profile",
  authMiddleware.verifyToken,
  authController.getUserProfile
);

// Update User Profile
router.put(
  "/profile",
  authMiddleware.verifyToken,
  authController.updateUserProfile
);

module.exports = router;
