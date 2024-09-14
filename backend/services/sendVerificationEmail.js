const transporter = require('../config/emailConfig');
const crypto = require('crypto');
const dotenv = require('dotenv')
dotenv.config()

const sendVerificationEmail = async (email, token) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Life-Flow Email Verification',
      text: `Please verify your email by clicking on the link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

module.exports = { sendVerificationEmail, generateVerificationToken };
