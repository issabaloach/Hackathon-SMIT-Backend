import express from 'express'
const GuarantorRouter = express.Router();
import guarantorController from '../controllers/guarantorController.js'
import AuthMiddleware from '../middleware/authentication.js';

// Add guarantors to a loan (protected route)
router.post('/add', 
  AuthMiddleware.authenticate,
  guarantorController.addGuarantors
);

// Get guarantors for a specific loan
router.get('/:loanId', 
  AuthMiddleware.authenticate,
  guarantorController.getGuarantorsForLoan
);

// Update guarantor status (admin only)
router.patch('/:guarantorId/status', 
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictToAdmin,
  guarantorController.updateGuarantorStatus
);

export default GuarantorRouter