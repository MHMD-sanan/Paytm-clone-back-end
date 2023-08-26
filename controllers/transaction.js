const Transaction = require("../models/Transaction");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Find a user by their email address
 * @route POST /api/transaction/findUser
 * @param {Object} req - Request object with recipient's email
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.findUser = async (req, res, next) => {
  try {
    const { recipientEmail } = req.body;
    if (!recipientEmail) {
      return next(new ErrorResponse("User not found", 401));
    }
    const user = await User.findOne({ email: recipientEmail });
    if (!user) {
      return next(new ErrorResponse("User not found", 401));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get transaction history associated with the user
 * @route GET /api/transaction/history
 * @param {Object} req - Request object with user ID
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("recipient", "userName")
      .populate("sender", "userName");

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
