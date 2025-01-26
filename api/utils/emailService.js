// Email Service Utility
const emailService = {
    // Configure transporter
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }),
  
    // Send temporary password email
    async sendTemporaryPasswordEmail(email, password) {
      try {
        await this.transporter.sendMail({
          from: '"Saylani Microfinance" <noreply@saylani.org>',
          to: email,
          subject: 'Temporary Password for Your Account',
          html: `
            <h2>Welcome to Saylani Microfinance</h2>
            <p>Your temporary password is: <strong>${password}</strong></p>
            <p>Please log in and change your password immediately.</p>
          `
        });
      } catch (error) {
        console.error('Email Send Error:', error);
        throw new Error('Failed to send email');
      }
    },
  
    // Send appointment confirmation
    async sendAppointmentConfirmation(email, appointmentDetails) {
      try {
        await this.transporter.sendMail({
          from: '"Saylani Microfinance" <noreply@saylani.org>',
          to: email,
          subject: 'Loan Application Appointment Confirmed',
          html: `
            <h2>Appointment Confirmation</h2>
            <p>Token Number: <strong>${appointmentDetails.tokenNumber}</strong></p>
            <p>Date: ${appointmentDetails.date}</p>
            <p>Time: ${appointmentDetails.time}</p>
            <p>Location: ${appointmentDetails.officeLocation}</p>
          `
        });
      } catch (error) {
        console.error('Appointment Email Error:', error);
        throw new Error('Failed to send appointment email');
      }
    }
  };

  module.exports = {
    emailService,
  }