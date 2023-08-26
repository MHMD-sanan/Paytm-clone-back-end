const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

/**
 * @route GET /api/request/getRequests
 * @desc Get all payment requests associated with the logged-in user
 * @access Private
 */
router.get("/getRequests", requestController.getRequests);

/**
 * @route POST /api/request/sendRequest
 * @desc Send a payment request to a recipient
 * @access Private
 */
router.post("/sendRequest", requestController.sendRequest);

module.exports = router;
