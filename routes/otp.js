const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

//send otp
router.post("/sendOtp", otpController.sendOtp);
//verify otp
router.post("/verifyOtp", otpController.verifyOtp);

module.exports = router;
