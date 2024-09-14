const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getCompletedAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getNotCompletedAppointments,
} = require("../controllers/appointmentController");

const verifyToken = require("../middlewares/verifyToken");
const checkAdmin = require("../middlewares/checkAdmin");
const checkDonor = require("../middlewares/checkDonor");
const checkHospital = require("../middlewares/checkHospital");

// Donor can create an appointment
router.post("/",  createAppointment);

// Admin can view all appointments
router.get("/",  getAllAppointments);

// Admin can view all completed appointments

router.get("/completed", getCompletedAppointments); // Add the new route

// Admin can view not completed appointments

router.get("/not-completed", getNotCompletedAppointments); // Add the new route

// Admin can view a specific appointment by ID
router.get("/:id",  getAppointmentById);

// Hospital can update appointment status
router.put("/:id/status", updateAppointmentStatus);

// Hospital can delete an appointment
router.delete("/:id",  deleteAppointment);

module.exports = router;
