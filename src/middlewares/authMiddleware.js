const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * JWT Authentication Middleware
 * 
 * This middleware verifies the JWT token from the Authorization header.
 * If valid, it attaches the user data to req.user for use in protected routes.
 * 
 * Usage: Add this middleware to any route that requires authentication
 * Example: router.get("/me", authMiddleware, controller.getMe);
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Step 1: Get token from Authorization header
        // Format: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.split(" ")[1];

        // Step 2: Verify token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 3: Find user from database to ensure they still exist
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Token is invalid.",
            });
        }

        // Step 4: Attach user data to request object
        // This makes user info available in protected routes
        req.user = {
            userId: user.id,
            username: user.username,
            role: user.role,
        };

        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);

        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = authMiddleware;
