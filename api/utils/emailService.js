import nodemailer from 'nodemailer'
const emailService = {
  async sendTemporaryPasswordEmail(email, temporaryPassword) {
    try {
      // Configure your email transporter (example with Gmail)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Temporary Password',
        text: `Your temporary password is: ${temporaryPassword}. Please change it upon first login.`
      };

      // Send email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send temporary password email');
    }
  }
};

export default emailService