import jwt from 'jsonwebtoken';

const AuthMiddleware = {
  /**
   * Validates request input based on the provided schema.
   * @param {Object} schema - Joi validation schema.
   */
  validateInput: (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          success: false,
          errors: error.details.map((detail) => detail.message), // Collect all validation errors
        });
      }
      next();
    };
  },

  restrictToAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  },  
  /**
   * Verifies JWT token and attaches the decoded user to the request.
   */
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in to access this resource.',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded payload (e.g., user data) to `req.user`
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
    }
  },
};

export default AuthMiddleware;
