const Hospital = require("../models/Hospital");

// Get All Hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isVerified: true });
    return res.status(200).json({ data: hospitals });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Get One hospital using a specific ID
const getOneHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    return res.status(200).json({ data: hospital });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Update hospital using a specific ID
const updateHospital = async (req, res) => {
  const { name, email, phone, address, city } = req.body;

  const updatedFields = {
    name,
    email,
    phone,
    address,
    city,
  };

  try {
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    return res
      .status(201)
      .send({ message: "Hospital Updated Successfully", data: hospital });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Delete a hospital using a specific ID
const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    await Hospital.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  getAllHospitals,
  getOneHospital,
  updateHospital,
  deleteHospital,
};
