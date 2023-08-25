const ErrorResponse = require("../utils/errorResponse");
const otpMailer = require("../utils/otp");

exports.sendOtp = async (req, res, next) => {
  try {
    const { recipientEmail } = req.body;
    let mailDetails = {
      from: "muhammedsanan14@gmail.com",
      to: recipientEmail,
      subject: "Forgot password",
      html: `<p>Hi, ${otpMailer.OTP}is the OTP to for completing your transaction</p>`,
    };
    otpMailer.mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("OTP mailed");
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return next(new ErrorResponse("No otp found", 401));
    }
    if (otp == otpMailer.OTP) {
      res.status(200).json({
        success: true,
      });
    }
  } catch (err) {
    console.log("catch");
    next(err);
  }
};
