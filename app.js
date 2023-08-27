// Load environment variables from .env file
require("dotenv").config();

// Import required libraries
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const app = express();

// Set up CORS middleware with allowed origins from environment variable
const allowedOrigins = JSON.parse(process.env.ORIGIN);
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Connect to the database
connectDb();

// Parse incoming JSON data
app.use(express.json());

// Import route handlers
const authRoutes = require("./routes/auth");
const transactionsRoutes = require("./routes/transaction");
const requestRoutes = require("./routes/request");

// Set up route handlers
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionsRoutes);
app.use("/api/request", requestRoutes);

// Handle unknown routes with a 404 response
app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

// Custom error handling middleware
app.use(require("./middlewares/errorMiddleware"));

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
