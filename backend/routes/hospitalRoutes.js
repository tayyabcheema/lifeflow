const express = require("express");
const router = express.Router();
const {
  getAllHospitals,
  getOneHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitalController");
const verifyToken = require("../middlewares/verifyToken");
const checkAdmin = require("../middlewares/checkAdmin");

// Get all hospitals (Admin only)
router.get("/",   getAllHospitals);

// Get a single hospital by ID (Admin only)
router.get("/:id",  getOneHospital);

// Update a hospital by ID (Admin only)
router.put("/:id",  updateHospital);

// Delete a hospital by ID (Admin only)
router.delete("/:id",  deleteHospital);

module.exports = router;
