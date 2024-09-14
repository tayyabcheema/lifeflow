const checkDonor = (req, res, next) => {
  if (!req.user.donorId) {
    return res.status(403).json({ message: "Access Denied: Donor privileges required" });
  }
  next();
};

module.exports = checkDonor;
