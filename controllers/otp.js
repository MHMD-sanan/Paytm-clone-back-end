const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");
const otpMailer = require("../utils/otp");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const PaymentRequest = require("../models/PaymentRequest");

/**
 * Send OTP to the recipient's email
 * @route POST /api/otp/send
 * @param {Object} req - Request object with recipient's email
 * @param {Object} res - Response object
 * @param {function} next - Next middleware function
 */
exports.sendOtp = async (req, res, next) => {
  try {
    const { recipientEmail } = req.body;

    // Prepare email details for sending OTP
    const mailDetails = {
      from: "muhammedsanan14@gmail.com",
      to: recipientEmail,
      subject: "Paytm wallet",
      html: `<p>Hi, ${otpMailer.OTP} is the OTP for completing your transaction.</p>`,
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
