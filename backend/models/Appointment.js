const mongoose = require("mongoose");

// Define the schema for the Appointment model
const appointmentSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value >= new Date();
        },
        message: "Appointment date must be in the future.",
      },
    },
    time: {
      type: String,
      required: true,
      // match: [/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, "Please use a valid time format (hh:mm AM/PM)."],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
