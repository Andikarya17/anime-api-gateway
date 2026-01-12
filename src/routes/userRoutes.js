const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// GET /user/me - Get current user profile (protected route)
router.get("/me", authMiddleware, userController.getMe);

// GET /user/api-key - Get current user's API key (protected route)
router.get("/api-key", authMiddleware, userController.getApiKey);

// POST /user/api-key/regenerate - Generate new API key (protected route)
router.post("/api-key/regenerate", authMiddleware, userController.regenerateApiKey);

module.exports = router;
