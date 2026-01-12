const { User } = require("../models");

/**
 * GET /me
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

module.exports = {
    getMe,
};
