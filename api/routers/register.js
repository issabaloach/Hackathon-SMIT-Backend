import express from 'express';
import Register, { validateRegister } from '../models/registerModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  // Validate input data
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const { name, email, cnic, password } = req.body;

  try {
    // Check if the email or CNIC already exists
    const existingUser = await Register.findOne({ $or: [{ email }, { cnic }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or CNIC already in use'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new Register({
      name,
      email,
      cnic,
      password: hashedPassword
    });

    // Save the new user
    await newUser.save();

    // Optionally, create an authentication token
    const token = newUser.generateAuthToken();

    // Respond with success and the token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later'
    });
  }
});

export default router;
