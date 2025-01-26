// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tokenNumber: {
      type: String,
      unique: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    officeLocation: {
      type: String,
      required: true
    },
    qrCode: {
      type: String // URL or file path to QR code
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED'
    }
  }, { timestamps: true });