const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Middleware to protect routes that require authentication
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
const auth = async (req, res, next) => {
  let token;

  // Check if Authorization header contains Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If token is not present, return error
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
    
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with the decoded token
    const user = await User.findById(decoded.id);

    // If user not found, return error
    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    // Attach user to request object for further use
    req.user = user;

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

module.exports = auth;
