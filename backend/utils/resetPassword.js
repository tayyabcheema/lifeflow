const resetPassword = async (req, res, next) => {
    const { token } = req.query;
    const { newPassword } = req.body;
  
    try {
      const user = await Donor.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      }) || await Hospital.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return next(createError(400, "Password reset token is invalid or has expired."));
      }
  
      user.password = await bcrypt.hash(newPassword, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully."
      });
    } catch (error) {
      next(createError(500, "Error in resetting password"));
    }
  };
  
  module.exports = { resetPassword };
  