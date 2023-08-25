const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

//find user
router.post("/findUser", transactionController.findUser);

// Fund transfer route
router.post("/transfer", transactionController.transferFunds);

// Transaction history route
router.get("/history", transactionController.getTransactionHistory);

// Payment request route
// router.post("/request-payment", transactionController.requestPayment);

module.exports = router;
