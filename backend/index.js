const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./config/connectDB");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const bloodStockRoutes = require("./routes/bloodStockRoutes");

dotenv.config();

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: ["https://lifeflow-frontend-client.vercel.app", "https://lifeflow-admin.vercel.app"], // Your frontend origin
  credentials: true, // This is important to allow cookies to be sent from the frontend
};

app.use(cors(corsOptions));

app.get("/", (req,res)=>{
  res.send("Hello Nodejs")
})

// Route middlewares
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blood-stock", bloodStockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
  });
});

// Start the server
app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
