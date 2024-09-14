const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema for the Hospital model
const hospitalSchema = new mongoose.Schema(
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
      match: [/^((\+92)|(0))3\d{9}$/, "Please enter a valid Pakistani phone number."],
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
    bloodStock: {
      Aplus: { type: Number, default: 0 },
      Aminus: { type: Number, default: 0 },
      Bplus: { type: Number, default: 0 },
      Bminus: { type: Number, default: 0 },
      ABplus: { type: Number, default: 0 },
      ABminus: { type: Number, default: 0 },
      Oplus: { type: Number, default: 0 },
      Ominus: { type: Number, default: 0 },
    },
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
// hospitalSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
