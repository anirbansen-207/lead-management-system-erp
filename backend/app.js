import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// Allow requests from the same origin
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const PORT = process.env.PORT || 5000;

// Connect frontend and backend with credentials support
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// Add basic HTTP security headers
app.use(helmet());

// Parse incoming JSON data
app.use(express.json());

// Read cookies from incoming requests
app.use(cookieParser());

// Basic API health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lead management ERP Backend is running"
  });
});

// Auth Route
app.use("/api/auth", authRoutes);
// user Route
app.use("/api/users", userRoutes);
// lead Route
app.use("/api/leads", leadRoutes);
// dashboard Route
app.use("/api/dashboard", dashboardRoutes);

// Start the server only after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
