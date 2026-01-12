const { User, ApiLog } = require("../models");

/**
 * GET /admin/users
 * Returns list of all users (admin only)
 * Excludes password field for security
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "role", "last_login_at", "createdAt", "updatedAt"],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * GET /admin/logs
 * Returns list of all API access logs (admin only)
 * Includes username via JOIN with users table
 */
const getAllLogs = async (req, res) => {
    try {
        const logs = await ApiLog.findAll({
            order: [["timestamp", "DESC"]],
            limit: 100, // Limit to recent 100 logs for performance
            include: [
                {
                    model: User,
                    attributes: ["username"],
                    required: false,
                },
            ],
        });

        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        console.error("Get all logs error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    getAllUsers,
    getAllLogs,
};
