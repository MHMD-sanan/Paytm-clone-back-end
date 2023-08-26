const Request = require("../models/PaymentRequest");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Get all payment requests associated with the user
 * @route GET /api/request
 * @param {Object} req - Request object with user ID
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.getRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const requests = await Request.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender")
      .populate("recipient");
      
    sendResponse(res, { success: true, requests }, 200);
  } catch (err) {
    next(err);
  }
};

/**
 * Send a payment request to another user
 * @route POST /api/request
 * @param {Object} req - Request object with recipient's email and amount
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.sendRequest = async (req, res, next) => {
  try {
    const { recipientEmail, amount } = req.body;
    const sender = await User.findById(req.user._id);
    const recipient = await User.findOne({ email: recipientEmail });

    const request = await Request.create({
      sender: sender._id,
      recipient: recipient._id,
      amount,
    });

    sendResponse(res, { success: true }, 201);
  } catch (err) {
    next(err);
  }
};
