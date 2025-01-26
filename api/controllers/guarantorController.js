import Guarantor from '../models/guarantorModal.js'
import Loan from '../models/loanModal.js'
import mongoose from 'mongoose';

const guarantorController = {
  // Add Guarantors to a Loan
  async addGuarantors(req, res) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const { loanId, guarantors } = req.body;

      // Validate loan exists
      const loan = await Loan.findById(loanId).session(session);
      if (!loan) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Loan not found' });
      }

      // Validate guarantor data
      const validatedGuarantors = guarantors.map(guarantor => ({
        ...guarantor,
        loan: loanId,
        status: 'Pending'
      }));

      // Add guarantors within transaction
      const savedGuarantors = await Guarantor.insertMany(validatedGuarantors, { session });

      // Update loan with guarantor references
      loan.guarantors = savedGuarantors.map(g => g._id);
      await loan.save({ session });

      await session.commitTransaction();

      res.status(201).json({ 
        message: 'Guarantors added successfully', 
        guarantors: savedGuarantors 
      });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ 
        message: 'Failed to add guarantors', 
        error: error.message 
      });
    } finally {
      session.endSession();
    }
  },

  // Get Guarantors for a Specific Loan
  async getGuarantorsForLoan(req, res) {
    try {
      const { loanId } = req.params;

      const guarantors = await Guarantor.find({ loan: loanId });

      if (!guarantors.length) {
        return res.status(404).json({ message: 'No guarantors found for this loan' });
      }

      res.json(guarantors);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to retrieve guarantors', 
        error: error.message 
      });
    }
  },

  // Update Guarantor Status
  async updateGuarantorStatus(req, res) {
    try {
      const { guarantorId } = req.params;
      const { status } = req.body;

      const guarantor = await Guarantor.findByIdAndUpdate(
        guarantorId, 
        { status }, 
        { new: true }
      );

      if (!guarantor) {
        return res.status(404).json({ message: 'Guarantor not found' });
      }

      res.json({
        message: 'Guarantor status updated',
        guarantor
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to update guarantor status', 
        error: error.message 
      });
    }
  }
};

module.exports = guarantorController;