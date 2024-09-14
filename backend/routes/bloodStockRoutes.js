const express = require("express");
const router = express.Router();
const {
  createBloodStock,
  getAllBloodStock,
  getBloodStockById,
  updateBloodStockQuantity,
  deleteBloodStock,
  getStockForAdmin
} = require("../controllers/bloodStockController");

const verifyToken = require("../middlewares/verifyToken");
const checkAdmin = require("../middlewares/checkAdmin");
const checkHospital = require("../middlewares/checkHospital");

// Utility function to check admin or hospital roles
const checkAdminOrHospital = (req, res, next) => {
  if (req.user.adminId) {
    return checkAdmin(req, res, next);
  }
  if (req.user.hospitalId) {
    return checkHospital(req, res, next);
  }
  return res.status(403).json({ message: "Access denied" });
};

// Hospital can create a blood stock entry
router.post("/",  createBloodStock);

// Admin and Hospital can view all blood stock entries
router.get("/",  getAllBloodStock);

// Admin can view the Blood Stock

router.get("/admin-only", getStockForAdmin )

// Admin and Hospital can view a specific blood stock entry by ID
router.get("/:id",  getBloodStockById);

// Hospital can update blood stock quantity
router.put("/:id/quantity",  updateBloodStockQuantity);

// Hospital can delete a blood stock entry
router.delete("/:id",  deleteBloodStock);

module.exports = router;
