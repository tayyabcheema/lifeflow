const Appointment = require("../models/Appointment");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");

// Create a new appointment

const createAppointment = async (req, res) => {
  try {
    const { donorId, hospitalId, date, time } = req.body;

    console.log("Received donorId:", donorId);
    console.log("Received hospitalId:", hospitalId);

    // Check if donor and hospital exist
    const donor = await Donor.findById(donorId);
    const hospital = await Hospital.findById(hospitalId);

    if (!donor) {
      console.log("Donor not found with ID:", donorId);
      return res.status(404).json({ message: "Donor not found" });
    }

    if (!hospital) {
      console.log("Hospital not found with ID:", hospitalId);
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Check if donor already has an appointment on the same date
    const existingAppointment = await Appointment.findOne({
      donor: donorId,
      date: new Date(date).toISOString().split("T")[0], // Ensure date comparison ignores time
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "Donor already has an appointment on this date" });
    }

    const newAppointment = new Appointment({
      donor: donorId,
      center: hospitalId,
      date,
      time,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("donor center");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all completed appointments
const getCompletedAppointments = async (req, res) => {
  try {
    const completedAppointments = await Appointment.find({
      status: "Completed",
    }).populate("donor center");
    res.status(200).json(completedAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments that are not completed
const getNotCompletedAppointments = async (req, res) => {
  try {
    const notCompletedAppointments = await Appointment.find({
      status: { $ne: "Completed" },
    }).populate("donor center");
    res.status(200).json(notCompletedAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "donor center"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("donor center");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getCompletedAppointments,
  getNotCompletedAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
