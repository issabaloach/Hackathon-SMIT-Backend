// Appointment Controller
const appointmentController = {
    // Generate Appointment Slip with QR Code
    async generateAppointmentSlip(req, res) {
      try {
        const { loanId } = req.body;
  
        // Find loan and validate
        const loan = await Loan.findById(loanId).populate('user');
        if (!loan) {
          return res.status(404).json({ message: 'Loan not found' });
        }
  
        // Generate token number
        const tokenNumber = `SWF-${Date.now().toString().slice(-6)}`;
  
        // Generate QR Code
        const qrCodePath = await qrCodeGenerator.generate({
          tokenNumber,
          loanId,
          userId: loan.user._id
        });
  
        // Create appointment (simplified scheduling)
        const appointment = new Appointment({
          loan: loanId,
          user: loan.user._id,
          tokenNumber,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          time: '10:00 AM',
          officeLocation: 'Saylani Welfare Head Office, Karachi',
          qrCode: qrCodePath
        });
  
        await appointment.save();
  
        res.json({
          message: 'Appointment slip generated',
          appointment: {
            tokenNumber,
            date: appointment.date,
            time: appointment.time,
            officeLocation: appointment.officeLocation,
            qrCodeUrl: appointment.qrCode
          }
        });
      } catch (error) {
        res.status(500).json({ 
          message: 'Failed to generate appointment slip', 
          error: error.message 
        });
      }
    },
  
    // List Appointments for Admin
    async listAppointments(req, res) {
      try {
        const { city, country } = req.query;
  
        // Build filter
        const filter = {};
        if (city) filter['officeLocation'] = { $regex: city, $options: 'i' };
        // Note: Actual country filtering would require more complex location logic
  
        const appointments = await Appointment.find(filter)
          .populate('loan')
          .populate('user');
  
        res.json(appointments);
      } catch (error) {
        res.status(500).json({ 
          message: 'Failed to retrieve appointments', 
          error: error.message 
        });
      }
    }
  };
  
  module.exports = {
    Guarantor: mongoose.model('Guarantor', guarantorSchema),
    Appointment: mongoose.model('Appointment', appointmentSchema),
    guarantorController,
    appointmentController
  };