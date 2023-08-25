const SendResponse = (res, user, statusCode) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    token,
    user,
    success: true,
  });
};

module.exports = SendResponse;
