const dotenv = require("dotenv");
dotenv.config();

const cookieOptions = async (req, res) => {
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag in production
    sameSite: "lax", // Helps mitigate CSRF attacks
  });
};

module.exports = cookieOptions;
