
const loanCalculator = {
  calculateMonthlyPayment(principal, annualInterestRate, years) {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfPayments = years * 12;

    return principal * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  },

  estimateLoanBreakdown(amount, initialDeposit, interestRate = 5, years = 3) {
    const principal = amount - initialDeposit;
    const monthlyPayment = this.calculateMonthlyPayment(principal, interestRate, years);
    
    return {
      principal,
      initialDeposit,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(monthlyPayment * years * 12),
      totalInterest: Math.round((monthlyPayment * years * 12) - principal)
    };
  }
};

module.exports = {
  loanCalculator
};