const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// All admin routes require:
// 1. JWT authentication (authMiddleware)
// 2. Admin role (adminMiddleware)
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /admin/users - Get all users
router.get("/users", adminController.getAllUsers);

// GET /admin/logs - Get all API logs
router.get("/logs", adminController.getAllLogs);

module.exports = router;
