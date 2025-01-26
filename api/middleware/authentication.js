import jwt from 'jsonwebtoken';
import { User } from'../models/User';

const authMiddleware = {
  // Verify JWT Token
  async verifyToken(req, res, next) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findOne({ 
        _id: decoded._id, 
        'tokens.token': token 
      });

      if (!user) {
        throw new Error();
      }

      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Please authenticate' });
    }
  },

  // Check User Role
  checkRole(roles) {
    return async (req, res, next) => {
      try {
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Access denied' });
        }
        next();
      } catch (error) {
        res.status(500).json({ message: 'Authorization error' });
      }
    };
  },

  // Validate Input
  validateInput(schema) {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body);
        next();
      } catch (error) {
        res.status(400).json({ 
          message: 'Validation failed', 
          errors: error.details 
        });
      }
    };
  }
};

module.exports = authMiddleware;