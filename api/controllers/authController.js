import {User} from '../models/userModal'
const authController = {
    // User Registration
    async register(req, res) {
      try {
        const { cnic, email, name } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ cnic }, { email }] });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
  
        // Generate temporary password
        const temporaryPassword = Math.random().toString(36).slice(-8);
  
        // Create new user
        const user = new User({
          cnic,
          email,
          name,
          password: temporaryPassword,
          isFirstLogin: true
        });
  
        await user.save();
  
        // Send email with temporary password
        await emailService.sendTemporaryPasswordEmail(email, temporaryPassword);
  
        res.status(201).json({ 
          message: 'User registered successfully. Check email for temporary password.',
          userId: user._id 
        });
      } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
      }
    },
  
    // User Login
    async login(req, res) {
      try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        const token = user.generateAuthToken();
  
        res.json({ 
          token, 
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email,
            isFirstLogin: user.isFirstLogin 
          } 
        });
      } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
      }
    },
  
    // Change Password (first login)
    async changePassword(req, res) {
      try {
        const { newPassword } = req.body;
        const user = req.user;
  
        if (!user.isFirstLogin) {
          return res.status(400).json({ message: 'Password can only be changed on first login' });
        }
  
        user.password = newPassword;
        user.isFirstLogin = false;
        await user.save();
  
        res.json({ message: 'Password changed successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Password change failed', error: error.message });
      }
    }
  };

 export default authController