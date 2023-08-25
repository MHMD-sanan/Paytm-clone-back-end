const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const ErrorResponse = require("../utils/errorResponse");

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

exports.transferFunds = async (req, res, next) => {
  const { recipientEmail, amount } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sender = await User.findById(req.user._id);
    const recipient = await User.findOne({ email: recipientEmail });

    if (sender.walletBalance < amount) {
      return next(new ErrorResponse("Insufficient balance", 401));
    }
    const money=Number(amount)
    // Update sender and recipient wallet balances
    sender.walletBalance -= money;
    recipient.walletBalance += money;

    await sender.save();
    await recipient.save();

    // Create a transaction record
    await Transaction.create({
      sender: sender._id,
      recipient: recipient._id,
      amount,
    });
    await session.commitTransaction();
    sendResponse(res, sender, 200);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

exports.getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate("recipient", "userName").populate("sender", "userName")
    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
