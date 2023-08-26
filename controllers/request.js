const Request = require("../models/PaymentRequest");
const User = require("../models/User");

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

    res.status(200).json({
      success: true,
      requests,
    });
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

    await Request.create({
      sender: sender._id,
      recipient: recipient._id,
      amount,
    });

    res.status(201).json({
      success:true
    })
  } catch (err) {
    next(err);
  }
};
