// Loan Controller
const loanController = {

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
  
        const loan = new Loan({
          user: req.user._id,
          category,
          subcategory,
          amount,
          period,
          initialDeposit,
          guarantors,
          documents
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
    }
  };
  

  export default loanController