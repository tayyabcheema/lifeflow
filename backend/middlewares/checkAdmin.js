const checkAdmin = (req, res, next) => {
  if (!req.user.adminId) {
    return res.status(403).json({ message: "Access Denied: Admin privileges required" });
  }
  next();
};

module.exports = checkAdmin;
