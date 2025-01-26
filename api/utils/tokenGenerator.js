
import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn = '1h') => {
  try {
    return jwt.sign(
      { id: payload }, 
      process.env.JWT_SECRET, 
      { expiresIn }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};