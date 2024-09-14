const checkHospital = (req, res, next) => {
  if (!req.user.hospitalId) {
    return res.status(403).json({ message: "Access Denied: Hospital privileges required" });
  }
  next();
};

module.exports = checkHospital;
