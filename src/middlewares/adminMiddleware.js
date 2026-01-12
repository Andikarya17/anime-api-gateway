/**
 * Admin Authorization Middleware
 * 
 * Checks if the authenticated user has admin role.
 * Must be used AFTER authMiddleware (JWT verification).
 * 
 * Usage: router.get("/users", authMiddleware, adminMiddleware, controller);
 */
const adminMiddleware = (req, res, next) => {
    // req.user is set by authMiddleware
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }

    // User is admin, proceed to next middleware/controller
    next();
};

module.exports = adminMiddleware;
