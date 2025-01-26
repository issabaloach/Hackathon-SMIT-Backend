import express from "express"
import appointmentController from "../controllers/appointmentController.js"
import AuthMiddleware from "../middleware/authentication.js"
import validateInput from "../middleware/validation.js"
import Joi from "joi"

const Appointmentrouter = express.Router()

// Generate Appointment Slip Validation Schema
const generateAppointmentSlipSchema = Joi.object({
  loanId: Joi.string().required(),
})

// Reschedule Appointment Validation Schema
const rescheduleAppointmentSchema = Joi.object({
  date: Joi.date().iso().min("now").required(),
  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  reason: Joi.string().optional().max(500),
})

// Generate Appointment Slip
Appointmentrouter.post(
  "/generate-slip",
  AuthMiddleware.verifyToken,
  validateInput(generateAppointmentSlipSchema),
  appointmentController.generateAppointmentSlip,
)

// Get User's Appointments
Appointmentrouter.get("/my-appointments", AuthMiddleware.verifyToken, appointmentController.getUserAppointments)

// Reschedule Appointment
Appointmentrouter.put(
  "/:id/reschedule",
  AuthMiddleware.verifyToken,
  validateInput(rescheduleAppointmentSchema),
  appointmentController.rescheduleAppointment,
)

// Cancel Appointment
Appointmentrouter.put("/:id/cancel", AuthMiddleware.verifyToken, appointmentController.cancelAppointment)

// Admin: List All Appointments
Appointmentrouter.get(
  "/list",
  AuthMiddleware.verifyToken,
  AuthMiddleware.restrictToAdmin,
  appointmentController.listAppointments,
)

export default Appointmentrouter

