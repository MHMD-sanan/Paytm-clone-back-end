const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route POST /api/auth/login
 * @desc Log in an existing user
 * @access Public
 */
router.post("/login", authController.login);

module.exports = router;
