const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * ApiLog Model
 * 
 * Records every API access for auditing purposes.
 * Each log entry tracks which user accessed which endpoint and when.
 */
const ApiLog = sequelize.define(
    "ApiLog",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        endpoint: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "The full API endpoint path (from req.originalUrl)",
        },
        query_params: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "All query parameters as JSON string (from req.query)",
        },
        statusCode: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "HTTP status code of the response",
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "api_logs",
        timestamps: false, // We use custom timestamp field
    }
);

module.exports = ApiLog;
