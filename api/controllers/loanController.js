import Loan from '../models/loanModal.js'
import LOAN_CATEGORIES from '../config/loanCategories.js';

const loanController = {
  // Loan Calculation
  calculateLoan(req, res) {
    try {
      const { category, subcategory, amount, period, initialDeposit } = req.body;

      // Validate category and subcategory
      if (!LOAN_CATEGORIES[category]) {
        return res.status(400).json({ message: 'Invalid loan category' });
      }

      if (!LOAN_CATEGORIES[category].subcategories.includes(subcategory)) {
        return res.status(400).json({ message: 'Invalid loan subcategory' });
      }

      // Basic loan calculation (simplified)
      const principalAmount = amount - initialDeposit;
      const monthlyInterestRate = 0.01; // 1% monthly
      const numberOfMonths = period * 12;

      const monthlyPayment = principalAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

      res.json({
        principalAmount,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(monthlyPayment * numberOfMonths),
        initialDeposit
      });
    } catch (error) {
      res.status(500).json({ message: 'Loan calculation failed', error: error.message });
    }
  },

  // Submit Loan Request
  async submitLoanRequest(req, res) {
    try {
      const { 
        category, 
        subcategory, 
        amount, 
        period, 
        initialDeposit, 
        guarantors, 
        documents 
      } = req.body;

      // Perform loan calculation
      const principalAmount = amount - initialDeposit;
      const monthlyInterestRate = 0.01; // 1% monthly
      const numberOfMonths = period * 12;

      const monthlyPayment = principalAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

      const loan = new Loan({
        user: req.user._id,
        category,
        subcategory,
        amount,
        period,
        initialDeposit,
        guarantors,
        documents,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(monthlyPayment * numberOfMonths)
      });

      await loan.save();

      res.status(201).json({ 
        message: 'Loan request submitted successfully', 
        loanId: loan._id 
      });
    } catch (error) {
      res.status(500).json({ message: 'Loan request submission failed', error: error.message });
    }
  },

  // Get Loan Categories
  getLoanCategories(req, res) {
    res.json(LOAN_CATEGORIES);
  },

  // Get User's Loans
  async getUserLoans(req, res) {
    try {
      const loans = await Loan.find({ user: req.user._id })
        .populate('guarantors')
        .sort({ createdAt: -1 });

      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve loans', error: error.message });
    }
  },

  // Update Loan Status (Admin Only)
  async updateLoanStatus(req, res) {
    try {
      const { loanId } = req.params;
      const { status } = req.body;

      const loan = await Loan.findByIdAndUpdate(
        loanId, 
        { status }, 
        { new: true }
      );

      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }

      res.json({
        message: 'Loan status updated',
        loan
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update loan status', error: error.message });
    }
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;

    // Update loan status logic here
    const updatedLoan = await LoanModel.findByIdAndUpdate(loanId, { status }, { new: true });

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.status(200).json({ success: true, loan: updatedLoan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


export default loanController