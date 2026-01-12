const crypto = require("crypto");
const { User } = require("../models");

/**
 * GET /user/me
 * Returns the currently authenticated user's profile
 * This route is protected by authMiddleware
 */
const getMe = async (req, res) => {
    try {
        // req.user is set by authMiddleware after JWT verification
        const user = await User.findByPk(req.user.userId, {
            attributes: ["id", "username", "role", "last_login_at", "createdAt"],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * GET /user/api-key
 * Returns the current user's API key for gateway access
 * This route is protected by authMiddleware (JWT)
 */
const getApiKey = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ["api_key"],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // If user has no API key (legacy user), generate one
        if (!user.api_key) {
            const apiKey = crypto.randomBytes(32).toString("hex");
            await User.update({ api_key: apiKey }, { where: { id: req.user.userId } });

            return res.status(200).json({
                success: true,
                data: {
                    api_key: apiKey,
                    message: "API key generated for first time",
                },
            });
        }

        res.status(200).json({
            success: true,
            data: {
                api_key: user.api_key,
            },
        });
    } catch (error) {
        console.error("Get API key error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * POST /user/api-key/regenerate
 * Generates a new API key for the current user
 * Old API key becomes immediately invalid
 * This route is protected by authMiddleware (JWT)
 */
const regenerateApiKey = async (req, res) => {
    try {
        // Generate new cryptographically secure API key
        const newApiKey = crypto.randomBytes(32).toString("hex");

        // Update user's API key (old key immediately stops working)
        const [updatedRows] = await User.update(
            { api_key: newApiKey },
            { where: { id: req.user.userId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "API key regenerated successfully. Old key is now invalid.",
            data: {
                api_key: newApiKey,
            },
        });
    } catch (error) {
        console.error("Regenerate API key error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    getMe,
    getApiKey,
    regenerateApiKey,
};
