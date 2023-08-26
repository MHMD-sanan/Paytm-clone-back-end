const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

/**
 * @route POST /api/otp/sendOtp
 * @desc Send OTP to the recipient's email for verification
 * @access Private
 */
router.post("/sendOtp", otpController.sendOtp);

/**
 * @route POST /api/otp/verifyOtp
 * @desc Verify the provided OTP for a transaction
 * @access Private
 */
router.post("/verifyOtp", otpController.verifyOtp);

module.exports = router;
