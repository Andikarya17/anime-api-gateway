const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const apiRoutes = require("./routes/apiRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Connect to database and sync models
connectDB().then(() => {
  // Sync all models (creates tables if they don't exist)
  sequelize.sync({ alter: false }).then(() => {
    console.log("Database tables synced");
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Anime API Gateway is running"
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
