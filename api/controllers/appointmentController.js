import Appointment from "../models/appointmentModal.js"
import Loan from "../models/loanModal.js"
import qrCodeGenerator from "../utils/qrCodeGenerator.js"

const appointmentController = {
  generateAppointmentSlip: async (req, res, next) => {
    try {
      const { loanId } = req.body
      const user = req.user

      const loan = await Loan.findById(loanId)
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" })
      }

      const existingAppointment = await Appointment.findOne({
        loan: loanId,
        status: { $ne: "Cancelled" },
      })

      if (existingAppointment) {
        return res.status(400).json({ message: "Appointment already exists for this loan" })
      }

      const tokenNumber = `SWF-${Date.now().toString().slice(-6)}`

      const qrCodePath = await qrCodeGenerator.generate({
        tokenNumber,
        loanId,
        userId: user._id,
      })

      const appointment = new Appointment({
        loan: loanId,
        user: user._id,
        tokenNumber,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: "10:00 AM",
        officeLocation: "Saylani Welfare Head Office, Karachi",
        qrCode: qrCodePath,
        status: "Scheduled",
      })

      await appointment.save()

      res.status(201).json({
        message: "Appointment slip generated",
        appointment: {
          tokenNumber,
          date: appointment.date,
          time: appointment.time,
          officeLocation: appointment.officeLocation,
          qrCodeUrl: appointment.qrCode,
        },
      })
    } catch (error) {
      next(error)
    }
  },

  getUserAppointments: async (req, res, next) => {
    try {
      const appointments = await Appointment.find({
        user: req.user._id,
        status: { $ne: "Cancelled" },
      })
        .populate("loan")
        .sort({ date: 1 })

      res.json(appointments)
    } catch (error) {
      next(error)
    }
  },

  rescheduleAppointment: async (req, res, next) => {
    try {
      const { id } = req.params
      const { date, time, reason } = req.body

      const appointment = await Appointment.findOneAndUpdate(
        {
          _id: id,
          user: req.user._id,
          status: "Scheduled",
        },
        {
          date,
          time,
          rescheduleReason: reason,
          status: "Rescheduled",
        },
        { new: true },
      )

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found or cannot be rescheduled" })
      }

      res.json({
        message: "Appointment rescheduled successfully",
        appointment,
      })
    } catch (error) {
      next(error)
    }
  },

  cancelAppointment: async (req, res, next) => {
    try {
      const { id } = req.params

      const appointment = await Appointment.findOneAndUpdate(
        {
          _id: id,
          user: req.user._id,
          status: "Scheduled",
        },
        {
          status: "Cancelled",
        },
        { new: true },
      )

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found or cannot be cancelled" })
      }

      res.json({
        message: "Appointment cancelled successfully",
        appointment,
      })
    } catch (error) {
      next(error)
    }
  },

  listAppointments: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status } = req.query

      const filter = status ? { status } : {}

      const options = {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        populate: ["user", "loan"],
        sort: { date: -1 },
      }

      const appointments = await Appointment.paginate(filter, options)

      res.json({
        appointments: appointments.docs,
        totalPages: appointments.totalPages,
        currentPage: appointments.page,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default appointmentController

