// services/sendResetPasswordEmail.js
const transporter = require('../config/emailConfig');

const sendResetPasswordEmail = async (email, token) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n` +
            `Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n` +
            `${process.env.FRONTEND_URL}/reset-password?token=${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset password email sent to:', email);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
};

module.exports = sendResetPasswordEmail;
