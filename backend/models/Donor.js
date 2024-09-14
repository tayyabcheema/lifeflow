const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema for the Donor model
const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z\s]+$/.test(v);
        },
        message: "Name can only contain alphabets and spaces.",
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    medicalFit: {
      type: String,
      required: true,
      enum: ["Yes", "No"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^((\+92)|(0))3\d{9}$/,
        "Please enter a valid Pakistani phone number.",
      ],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      enum: ["Gujranwala", "Gujrat", "Mandi-Baha-Uddin"],
    },
    donationHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        hospital: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hospital",
          required: true,
        },
      },
    ],
    verificationToken: String,
    verificationCode: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
// donorSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;
