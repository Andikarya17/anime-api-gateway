const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /auth/register - Register new user
router.post("/register", authController.register);

// POST /auth/login - Login user
router.post("/login", authController.login);

module.exports = router;
