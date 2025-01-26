import express from "express";
const router = express.Router();
import appointmentController from "../controllers/appointmentController";
import authMiddleware from "../middleware/authMiddleware";
import joi from "joi";

// Generate Appointment Slip Validation Schema
const generateAppointmentSlipSchema = Joi.object({
  loanId: Joi.string().required(),
});

// Reschedule Appointment Validation Schema
const rescheduleAppointmentSchema = Joi.object({
  date: Joi.date().iso().required(),
  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
});

// Generate Appointment Slip
router.post(
  "/generate-slip",
  authMiddleware.verifyToken,
  authMiddleware.validateInput(generateAppointmentSlipSchema),
  appointmentController.generateAppointmentSlip
);

// Get User's Appointments
router.get(
  "/my-appointments",
  authMiddleware.verifyToken,
  appointmentController.getUserAppointments
);

// Reschedule Appointment
router.put(
  "/:id/reschedule",
  authMiddleware.verifyToken,
  authMiddleware.validateInput(rescheduleAppointmentSchema),
  appointmentController.rescheduleAppointment
);

// Cancel Appointment
router.put(
  "/:id/cancel",
  authMiddleware.verifyToken,
  appointmentController.cancelAppointment
);

// Admin: List All Appointments
router.get(
  "/list",
  authMiddleware.verifyToken,
  authMiddleware.checkRole(["admin"]),
  appointmentController.listAppointments
);

module.exports = router;
