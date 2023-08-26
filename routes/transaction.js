const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

/**
 * @route POST /api/transaction/findUser
 * @desc Find a user by recipient email
 * @access Private
 */
router.post("/findUser", transactionController.findUser);

/**
 * @route GET /api/transaction/history
 * @desc Get transaction history associated with the logged-in user
 * @access Private
 */
router.get("/history", transactionController.getTransactionHistory);

module.exports = router;
