const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

/**
 * @route GET /api/transaction/history
 * @desc Get transaction history associated with the logged-in user
 * @access Private
 */
router.get("/history", transactionController.getTransactionHistory);

/**
 * @route POST /api/transaction/findUser
 * @desc Find a user by recipient email
 * @access Private
 */
router.post("/findUser", transactionController.findUser);

/**
 * @route POST /api/otp/sendOtp
 * @desc Send OTP to the recipient's email for verification
 * @access Private
 */
router.post("/sendOtp", transactionController.sendOtp);

/**
 * @route POST /api/otp/verifyOtp
 * @desc Verify the provided OTP for a transaction
 * @access Private
 */
router.post("/verifyOtp", transactionController.verifyOtp);

module.exports = router;
