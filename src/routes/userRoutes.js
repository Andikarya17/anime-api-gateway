const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// GET /user/me - Get current user profile (protected route)
router.get("/me", authMiddleware, userController.getMe);

module.exports = router;
