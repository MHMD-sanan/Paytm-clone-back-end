const User = require("../models/User");
const SendResponse = require("../utils/sendResponse");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
  try {
    const { userName, email, password, mobileNumber } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      new ErrorResponse("Email or mobile number alreadt exists", 401);
    }
    const user = await User.create({
      userName,
      email,
      password,
      mobileNumber,
    });
    SendResponse(res, user, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 401)
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return next(new ErrorResponse("Invalid credentials", 401));
    // }
    if (user.password !== password) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    SendResponse(res, user, 200);
  } catch (err) {
    next(err);
  }
};
