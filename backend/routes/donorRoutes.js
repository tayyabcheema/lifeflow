const express = require("express");
const router = express.Router();
const {
  getAllDonors,
  getOneDonor,
  updateDonor,
  deleteDonor,
} = require("../controllers/donorController");
const verifyToken = require("../middlewares/verifyToken");
const checkAdmin = require("../middlewares/checkAdmin");

// Get all donors (Admin only)
router.get("/",  getAllDonors);

// Get a single donor by ID (Admin only)
router.get("/:id", getOneDonor);

// Update a donor by ID (Admin only)
router.put("/:id",   updateDonor);

// Delete a donor by ID (Admin only)
router.delete("/:id", deleteDonor);

module.exports = router;
