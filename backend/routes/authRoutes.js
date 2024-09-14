const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const checkAdmin = require("../middlewares/checkAdmin");
const checkDonor = require("../middlewares/checkDonor");
const checkHospital = require("../middlewares/checkHospital");

// Admin Auth Routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/admin/refresh", verifyToken, checkAdmin, refresh);
router.post("/admin/logout", verifyToken, checkAdmin, logout);

// Donor Auth Routes
router.post("/donor/register", registerDonor);
router.post("/donor/login", loginDonor);
router.post("/donor/refresh", verifyToken, checkDonor, refresh);
router.post("/donor/logout", verifyToken, checkDonor, logout);

// Hospital Auth Routes
router.post("/hospital/register", registerHospital);
router.post("/hospital/login", loginHospital);
router.post("/hospital/refresh", verifyToken, checkHospital, refresh);
router.post("/hospital/logout", verifyToken, checkHospital, logout);

// Verify Email Routes
router.get('/verify-email', verifyEmail);

// Password Reset Routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
