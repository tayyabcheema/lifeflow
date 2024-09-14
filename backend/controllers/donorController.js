const Donor = require("../models/Donor");

// Get All donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find({ isVerified: true });
    return res.status(200).json({ data: donors });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Get One donor by specific ID
const getOneDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    return res.json({ data: donor });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Update donor using specific ID
const updateDonor = async (req, res) => {
  const {
    name,
    age,
    bloodGroup,
    medicalFit,
    email,
    phone,
    address,
    city,
  } = req.body;

  const updatedFields = {
    name,
    age,
    bloodGroup,
    medicalFit,
    email,
    phone,
    address,
    city,
  };

  try {
    let donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    return res
      .status(201)
      .send({ message: "Donor Updated Successfully", data: donor });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Delete Donor using ID
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    await Donor.findByIdAndDelete(req.params.id);

    return res.json({ message: "Donor Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  getAllDonors,
  getOneDonor,
  updateDonor,
  deleteDonor,
};
