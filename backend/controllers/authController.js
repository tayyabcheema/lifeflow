const Admin = require("../models/Admin");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateTokens = require("../utils/generateTokens");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../services/sendPasswordResetEmail");
const cookieOptions = require("../utils/cookieOptions");
const {
  generateVerificationToken,
  sendVerificationEmail,
} = require("../services/sendVerificationEmail");
const createError = require("../utils/error");

// Admin Auth
const registerAdmin = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name || !email || !password || !phone) {
      return next(createError(400, "All fields are required"));
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(createError(400, "Admin already exists"));
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({ name, email, password: hashedPassword, phone });
    await admin.save();
    return res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    next(createError(500, "Error registering Admin"));
  }
};

const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(createError(400, "All fields are required"));
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(createError(404, "Admin not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return next(createError(400, "Invalid credentials"));
    }
    const { accessToken, refreshToken } = generateTokens({
      adminId: admin._id,
    });
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.status(200).json({
      message: "Successfully logged in",
      data: {
        accessToken,
        refreshToken,
        user: {
          adminId: admin._id,
          adminEmail: admin.email,
          adminName: admin.name,
        },
      },
    });
  } catch (error) {
    next(createError(500, "Admin Login Failed"));
  }
};

// Donor Auth
const registerDonor = async (req, res) => {
  try {
    const {
      name,
      age,
      bloodGroup,
      medicalFit,
      email,
      password,
      phone,
      address,
      city,
    } = req.body;

    // Check if email or phone number already exists in Donors or Hospitals
    const existingDonor = await Donor.findOne({ $or: [{ email }, { phone }] });
    const existingHospital = await Hospital.findOne({ $or: [{ email }, { phone }] });

    if (existingDonor || existingHospital) {
      return res.status(400).json({ message: "Email or phone number already exists" });
    }

    const verificationToken = generateVerificationToken();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDonor = new Donor({
      name,
      age,
      bloodGroup,
      medicalFit,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      verificationToken,
    });

    await newDonor.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "Donor registered successfully. Please check your email to verify your account",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const loginDonor = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(createError(400, "All fields are required"));
    }

    const donor = await Donor.findOne({ email });
    if (!donor) {
      return next(createError(404, "Donor not found"));
    }

    if (!donor.isVerified) {
      return next(
        createError(
          403,
          "Email is not verified. Please verify your email to log in."
        )
      );
    }

    const isPasswordValid = await bcrypt.compare(password, donor.password);
    if (!isPasswordValid) {
      return next(createError(400, "Invalid credentials"));
    }

    const { accessToken, refreshToken } = generateTokens({
      donorId: donor._id,
    });

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        accessToken,
        refreshToken,
        user: {
          donorId: donor._id,
          donorEmail: donor.email,
          donorName: donor.name,
        },
      },
    });
  } catch (error) {
    next(createError(500, "Donor login failed"));
  }
};

// Hospital Auth
const registerHospital = async (req, res, next) => {
  const { name, email, password, phone, address, city } = req.body;
  try {
    if (!name || !email || !password || !phone || !address || !city) {
      return next(createError(400, "All fields are required"));
    }

    // Check if email or phone number already exists in Hospitals or Donors
    const existingDonor = await Donor.findOne({ $or: [{ email }, { phone }] });
    const existingHospital = await Hospital.findOne({ $or: [{ email }, { phone }] });

    if (existingDonor || existingHospital) {
      return next(createError(400, "Email or phone number already exists"));
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt); // 12 salt rounds
    const verificationToken = generateVerificationToken();
    const hospital = new Hospital({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      verificationToken,
    });

    await hospital.save();
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      success: true,
      message:
        "Hospital registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    next(createError(500, "Error registering Hospital"));
  }
};



const loginHospital = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(createError(400, "All fields are required"));
    }

    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return next(createError(404, "Hospital not found"));
    }

    if (!hospital.isVerified) {
      return next(
        createError(
          403,
          "Email is not verified. Please verify your email to log in."
        )
      );
    }

    const isPasswordValid = await bcrypt.compare(password, hospital.password);
    if (!isPasswordValid) {
      return next(createError(400, "Invalid credentials"));
    }

    const { accessToken, refreshToken } = generateTokens({
      hospitalId: hospital._id,
    });

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        accessToken,
        refreshToken,
        user: {
          hospitalId: hospital._id,
          hospitalEmail: hospital.email,
          hospitalName: hospital.name,
        },
      },
    });
  } catch (error) {
    console.log(`Error during login: ${error.message}`);
    next(createError(500, "Hospital login failed"));
  }
};

// Token Refresh
const refresh = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(createError(401, "No token, authorization denied"));
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { adminId, donorId, hospitalId } = decoded;
    const newAccessToken = jwt.sign(
      { adminId, donorId, hospitalId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.log("Error verifying token", error.message);
    next(createError(401, "Token is not valid"));
  }
};

// Logout Function
const logout = (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  try {
    // Find the user by verification token
    let user = await Donor.findOne({ verificationToken: token });
    if (!user) {
      user = await Hospital.findOne({ verificationToken: token });
    }

    // If user not found, return error
    if (!user) {
      return next(createError(400, "Invalid or expired token"));
    }

    // Update user verification status and remove verification token
    user.isVerified = true;
    user.verificationToken = null;

    // Save the updated user to the database
    await user.save();

    // Log the updated user for debugging
    console.log("User after verification:", user);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying email:", error); // Log the error
    next(createError(500, `Error verifying email: ${error.message}`));
  }
};

// Request Password Reset

const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user =
      (await Donor.findOne({ email })) || (await Hospital.findOne({ email }));

    if (!user) {
      return next(createError(404, "User with this email does not exist."));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.log(error.message);
    next(createError(500, "Error in sending password reset email"));
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    const user =
      (await Donor.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })) ||
      (await Hospital.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      }));

    if (!user) {
      return next(
        createError(400, "Password reset token is invalid or has expired.")
      );
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    next(createError(500, "Error in resetting password"));
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  registerDonor,
  loginDonor,
  registerHospital,
  loginHospital,
  refresh,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};
