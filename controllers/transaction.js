const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");
const otpMailer = require("../utils/otp");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

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
 * Send OTP to the user email
 * @route POST /api/otp/send
 * @param {Object} req - Request object with recipient's email
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.sendOtp = async (req, res, next) => {
  try {
    const userEmail = req.user.email;

    // Prepare email details for sending OTP
    const mailDetails = {
      from: "muhammedsanan14@gmail.com",
      to: userEmail,
      subject: "Paytm wallet OTP",
      html: `<p>Hi, <br> ${otpMailer.OTP} is the OTP for completing your transaction on Paytm wallet.<br>If not requested by you, please contact Paytm customer support immediately</p>`,
    };

    // Send OTP email
    otpMailer.mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        return next(new ErrorResponse("Unable to send OTP", 401));
      } else {
        res.status(200).json({
          success: true,
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify OTP and perform transaction
 * @route POST /api/otp/verify
 * @param {Object} req - Request object with OTP and transaction details
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.verifyOtp = async (req, res, next) => {
  const { otp, recipientEmail, amount, paymentRequestId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!otp) {
      return next(new ErrorResponse("No OTP found", 401));
    }
    if (otp == otpMailer.OTP) {
      const sender = await User.findById(req.user._id);
      const recipient = await User.findOne({ email: recipientEmail });

      if (sender.walletBalance < amount) {
        return next(new ErrorResponse("Insufficient balance", 401));
      }
      const money = Number(amount);

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

      // Update payment request status
      if (paymentRequestId) {
        await PaymentRequest.findByIdAndUpdate(paymentRequestId, {
          $set: { status: "completed" },
        });
      }

      res.status(200).json({
        success: true,
      });
    } else {
      return next(new ErrorResponse("Invalid OTP", 401));
    }
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};
