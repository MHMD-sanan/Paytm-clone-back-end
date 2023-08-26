const ErrorResponse = require("../utils/errorResponse");

/**
 * Middleware to handle errors and send appropriate responses
 * @param {Error} err - The error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Clone the error object
  let error = { ...err };
  
  // Set error message to the error's message property
  error.message = err.message;

  // Handle duplicate key error (MongoDB unique constraint violation)
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Handle validation errors (Mongoose validation errors)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Send appropriate response
  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error",
  });
};

module.exports = errorHandler;
