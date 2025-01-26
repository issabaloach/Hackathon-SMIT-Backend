import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authentication.js';
import Register, { loginSchema, changePasswordSchema, validateRegister } from '../models/registerModal.js';

const Authrouter = express.Router();

// User Registration Route
Authrouter.post(
  '/register',
  authMiddleware.validateInput(Register),  // Validate input using the Joi schema
  authController.register  // Call the controller method for registration
);

// User Login Route
Authrouter.post(
  '/login',
  authMiddleware.validateInput(loginSchema),  // Validate input for login
  authController.login  // Call the login controller method
);

// Change Password Route
Authrouter.post(
  '/change-password',
  authMiddleware.verifyToken,  // Verify the token for security
  authMiddleware.validateInput(changePasswordSchema),  // Validate the new password
  authController.changePassword  // Call the controller method to change the password
);

// Get User Profile Route
Authrouter.get(
  '/profile',
  authMiddleware.verifyToken,  // Ensure user is authenticated
  authController.getUserProfile  // Retrieve the user profile
);

// Update User Profile Route
Authrouter.put(
  '/profile',
  authMiddleware.verifyToken,  // Verify token for security
  authController.updateUserProfile  // Update user profile information
);

export default Authrouter;
