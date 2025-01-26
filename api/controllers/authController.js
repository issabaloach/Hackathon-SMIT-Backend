import User from '../models/registerModal.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authController = {
  // Register Method
  async register(req, res) {
    try {
      const { name, email, cnic, password } = req.body;

      // Check if the user already exists
      const userExists = await User.findOne({ $or: [{ email }, { cnic }] });
      if (userExists) {
        return res.status(400).json({ message: 'Email or CNIC already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = new User({
        name,
        email,
        cnic,
        password: hashedPassword,
      });

      await newUser.save();

      // Generate JWT token
      const token = newUser.generateAuthToken();

      return res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Login Method
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = user.generateAuthToken();
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Change Password Method
  async changePassword(req, res) {
    try {
      const { newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      req.user.password = hashedPassword; // Update the user's password in the database

      await req.user.save();
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get User Profile Method
  async getUserProfile(req, res) {
    res.status(200).json(req.user);  // Send the logged-in user's profile data
  },

  // Update User Profile Method
  async updateUserProfile(req, res) {
    try {
      const { name, email } = req.body;
      req.user.name = name || req.user.name;  // Update only if new value is provided
      req.user.email = email || req.user.email;

      await req.user.save();
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export default authController;
