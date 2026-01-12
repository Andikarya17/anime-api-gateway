const { User } = require("../models");

/**
 * API Key Validation Middleware
 * 
 * Validates the X-API-Key header for gateway routes.
 * This middleware ensures that all API requests go through proper authentication.
 * 
 * Flow:
 * 1. Extract API key from X-API-Key header
 * 2. Look up user by API key in database
 * 3. If valid, attach user to req.apiUser
 * 4. If invalid or missing, return 401/403
 * 
 * Usage: router.use(apiKeyMiddleware) on all /api/* routes
 */
const apiKeyMiddleware = async (req, res, next) => {
    try {
        // Step 1: Get API key from X-API-Key header
        const apiKey = req.headers["x-api-key"];

        // Step 2: Check if API key is provided
        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No API key provided. Include X-API-Key header.",
            });
        }

        // Step 3: Find user by API key
        const user = await User.findOne({ where: { api_key: apiKey } });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Invalid API key.",
            });
        }

        // Step 4: Attach user data to request object
        // This makes user info available in controllers
        req.apiUser = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error("API Key middleware error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = apiKeyMiddleware;
