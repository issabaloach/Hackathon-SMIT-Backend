// Guarantor Controller
const guarantorController = {
    async addGuarantors(req, res) {
      try {
        const { loanId, guarantors } = req.body;
  
        // Validate loan exists
        const loan = await Loan.findById(loanId);
        if (!loan) {
          return res.status(404).json({ message: 'Loan not found' });
        }
  
        // Add guarantors
        const savedGuarantors = await Guarantor.insertMany(
          guarantors.map(guarantor => ({
            ...guarantor,
            loan: loanId
          }))
        );
  
        // Update loan with guarantor references
        loan.guarantors = savedGuarantors.map(g => g._id);
        await loan.save();
  
        res.status(201).json({ 
          message: 'Guarantors added successfully', 
          guarantors: savedGuarantors 
        });
      } catch (error) {
        res.status(500).json({ 
          message: 'Failed to add guarantors', 
          error: error.message 
        });
      }
    }
  };

  export default guarantorController