const User = require("../models/User");
const SendResponse = require("../utils/sendResponse");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Register a new user
 * @route POST /api/auth/register
 * @param {Object} req - Request object with user data
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.register = async (req, res, next) => {
  try {
    const { userName, email, password, mobileNumber } = req.body;
    
    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new ErrorResponse("Email or mobile number already exists", 401));
    }

    // Create a new user
    const user = await User.create({
      userName,
      email,
      password,
      mobileNumber,
    });

    // Send successful response
    SendResponse(res, user, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * User login
 * @route POST /api/auth/login
 * @param {Object} req - Request object with user credentials
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return next(new ErrorResponse("Please provide an email and password", 401));
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Compare passwords (replace with proper bcrypt comparison)
    if (user.password !== password) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Send successful response
    SendResponse(res, user, 200);
  } catch (err) {
    next(err);
  }
};
