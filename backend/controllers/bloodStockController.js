const BloodStock = require("../models/BloodStock");
const Hospital = require("../models/Hospital");

// Create a new blood stock entry
// const createBloodStock = async (req, res) => {
//   try {
//     const { hospitalId, bloodGroup, quantity } = req.body;

//     // Check if hospital exists
//     const hospital = await Hospital.findById(hospitalId);

//     if (!hospital) {
//       return res.status(404).json({ message: "Hospital not found" });
//     }

//     const existedBloodStock = await BloodStock.findOne({bloodGroup: bloodGroup, hospitalId: hospitalId})
//     if(existedBloodStock){
//       return res.status(401).json({message: "Blood Stock already exists again this Blood Group Instead creating new stock you can edit it"})
//     }

//     const newBloodStock = new BloodStock({
//       hospital: hospitalId,
//       bloodGroup,
//       quantity,
//     });

//     const savedBloodStock = await newBloodStock.save();
//     res.status(201).json(savedBloodStock);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const createBloodStock = async (req, res) => {
  try {
    const { hospitalId, bloodGroup, quantity } = req.body;

    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Check if blood stock for the specified blood group already exists for this hospital
    const existingBloodStock = await BloodStock.findOne({ bloodGroup, hospital: hospitalId });
    if (existingBloodStock) {
      return res.status(409).json({ message: "Blood stock for this blood group already exists for your hospital. Please edit the existing stock instead." });
    }

    // Create new blood stock
    const newBloodStock = new BloodStock({
      hospital: hospitalId,
      bloodGroup,
      quantity,
    });

    const savedBloodStock = await newBloodStock.save();
    res.status(201).json(savedBloodStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all blood stock entries

const getAllBloodStock = async (req, res) => {
  try {
    const { hospitalId } = req.query;

    const bloodStock = await BloodStock.find({ hospital: hospitalId }).populate("hospital");
    
    res.status(200).json({ data: bloodStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blood stock by ID
const getBloodStockById = async (req, res) => {
  try {
    const bloodStock = await BloodStock.findById(req.params.id).populate("hospital");
    
    if (!bloodStock) {
      return res.status(404).json({ message: "Blood stock entry not found" });
    }
    
    res.status(200).json(bloodStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update blood stock quantity
const updateBloodStockQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const bloodStock = await BloodStock.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    ).populate("hospital");

    if (!bloodStock) {
      return res.status(404).json({ message: "Blood stock entry not found" });
    }

    res.status(200).json(bloodStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blood stock entry
const deleteBloodStock = async (req, res) => {
  try {
    const bloodStock = await BloodStock.findByIdAndDelete(req.params.id);
    if (!bloodStock) {
      return res.status(404).json({ message: "Blood stock entry not found" });
    }
    res.status(200).json({ message: "Blood stock entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Stock for Admin Enteries

const getStockForAdmin = async (req, res) => {
  try {
    const bloodStock = await BloodStock.find().populate("hospital");
    res.status(200).json({ data: bloodStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createBloodStock,
  getAllBloodStock,
  getBloodStockById,
  updateBloodStockQuantity,
  deleteBloodStock,
  getStockForAdmin
};
