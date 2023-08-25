const Request = require("../models/PaymentRequest");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const ErrorResponse = require("../utils/errorResponse");

// get all payment request
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

// send request
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

    sendResponse(res, sender, 201);
  } catch (err) {
    next(err);
  }
};
