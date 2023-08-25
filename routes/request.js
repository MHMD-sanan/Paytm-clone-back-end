const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request");

// Middleware to authenticate requests
router.use(require("../middlewares/authMiddleware"));

router.get("/getRequests", requestController.getRequests);

router.post("/sendRequest", requestController.sendRequest);

module.exports = router;
