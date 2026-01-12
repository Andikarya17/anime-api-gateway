const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");

// POST /auth/register
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        // NOTE: Role is intentionally NOT accepted from request body
        // This prevents users from registering as admin
        // Admin accounts must be created manually in the database

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username already exists",
            });
        }

        // Hash password explicitly using bcrypt
        // Salt rounds = 10 (industry standard for balance of security and speed)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate cryptographically secure API key (32 bytes = 64 hex chars)
        const apiKey = crypto.randomBytes(32).toString("hex");

        // Create new user with hashed password and API key
        // Role is NOT set from request - it defaults to "user" in the model
        const user = await User.create({
            username,
            password: hashedPassword,
            api_key: apiKey,
            // role is intentionally omitted - defaults to "user"
        });

        // Return success response (without sensitive data)
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        // Handle Sequelize validation errors
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// POST /auth/login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            // Use generic message to prevent username enumeration
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Validate password using bcrypt compare
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Update last_login_at timestamp
        await user.update({ last_login_at: new Date() });

        // Generate JWT token
        // Payload contains userId and role for authorization checks
        const payload = {
            userId: user.id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "24h",
        });

        // Return success response with JWT token
        res.status(200).json({
    success: true,
    message: "Login successful",
    token: token,
    user: {
        userId: user.id,
        username: user.username,
        role: user.role,
    }
});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    register,
    login,
};
