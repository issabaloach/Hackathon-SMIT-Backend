

export const loanCalculator = {
  calculateMonthlyPayment(principal, annualInterestRate, years) {
    // Validate inputs
    if (principal <= 0 || annualInterestRate < 0 || years <= 0) {
      throw new Error('Invalid input parameters');
    }

    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfPayments = years * 12;

    return principal * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  },

  estimateLoanBreakdown(amount, initialDeposit, interestRate = 5, years = 3) {
    // Validate inputs
    if (amount <= 0 || initialDeposit < 0 || initialDeposit > amount) {
      throw new Error('Invalid amount or initial deposit');
    }

    const principal = amount - initialDeposit;
    const monthlyPayment = this.calculateMonthlyPayment(principal, interestRate, years);
    
    return {
      principal,
      initialDeposit,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100, // Round to 2 decimal places
      totalPayment: Math.round(monthlyPayment * years * 12 * 100) / 100,
      totalInterest: Math.round((monthlyPayment * years * 12 - principal) * 100) / 100
    };
  }
};