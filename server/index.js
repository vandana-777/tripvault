const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");

console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "Cloudinary API Key loaded:",
  !!process.env.CLOUDINARY_API_KEY
);
console.log(
  "Cloudinary API Secret loaded:",
  !!process.env.CLOUDINARY_API_SECRET
);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("TripVault Backend is Running 🚀");
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});