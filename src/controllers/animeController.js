const axios = require("axios");
const { ApiLog } = require("../models");

// Jikan API base URL
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

/**
 * GET /api/anime
 * 
 * Proxies anime search requests to Jikan API.
 * Logs each access to database for auditing.
 * 
 * Query Parameters:
 *   - q: Search query string (required)
 * 
 * Example: GET /api/anime?q=naruto
 */
const searchAnime = async (req, res) => {
    // Default status code (will be updated based on response)
    let statusCode = 500;

    try {
        const { q } = req.query;

        // Validate query parameter
        if (!q) {
            statusCode = 400;
            return res.status(400).json({
                success: false,
                message: "Query parameter 'q' is required",
            });
        }

        // Call Jikan API
        const jikanResponse = await axios.get(`${JIKAN_BASE_URL}/anime`, {
            params: { q },
        });

        statusCode = jikanResponse.status;

        // Return Jikan response directly (do not modify structure)
        res.status(200).json(jikanResponse.data);
    } catch (error) {
        console.error("Jikan API error:", error.message);

        // Handle Jikan API errors
        if (error.response) {
            statusCode = error.response.status;
            return res.status(error.response.status).json({
                success: false,
                message: "Jikan API error",
                error: error.response.data,
            });
        }

        // Network or other errors
        res.status(500).json({
            success: false,
            message: "Failed to fetch data from Jikan API",
        });
    } finally {
        // Log API access to database (always, regardless of success/failure)
        // This ensures every request is tracked for auditing purposes
        try {
            await ApiLog.create({
                userId: req.apiUser.id, // From apiKeyMiddleware (API key auth)
                // Use req.originalUrl for dynamic endpoint logging (scalable design)
                endpoint: req.originalUrl.split("?")[0], // Remove query string from path
                // Store ALL query parameters as JSON string (generic, not just 'q')
                query_params: Object.keys(req.query).length > 0
                    ? JSON.stringify(req.query)
                    : null,
                // statusCode is already set correctly:
                // - On success: jikanResponse.status (line 39)
                // - On API error: error.response.status (line 48)
                // - On network error: defaults to 500 (line 20)
                statusCode: statusCode,
                timestamp: new Date(),
            });
        } catch (logError) {
            // Log error but don't fail the request
            console.error("Failed to log API access:", logError.message);
        }
    }
};

/**
 * GET /api/manga
 * 
 * Proxies manga search requests to Jikan API.
 * Logs each access to database for auditing.
 * 
 * Query Parameters:
 *   - q: Search query string (required)
 * 
 * Example: GET /api/manga?q=one%20piece
 */
const searchManga = async (req, res) => {
    let statusCode = 500;

    try {
        const { q } = req.query;

        // Validate query parameter
        if (!q) {
            statusCode = 400;
            return res.status(400).json({
                success: false,
                message: "Query parameter 'q' is required",
            });
        }

        // Call Jikan API for manga
        const jikanResponse = await axios.get(`${JIKAN_BASE_URL}/manga`, {
            params: { q },
        });

        statusCode = jikanResponse.status;

        // Return Jikan response directly
        res.status(200).json(jikanResponse.data);
    } catch (error) {
        console.error("Jikan API error (manga):", error.message);

        if (error.response) {
            statusCode = error.response.status;
            return res.status(error.response.status).json({
                success: false,
                message: "Jikan API error",
                error: error.response.data,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch data from Jikan API",
        });
    } finally {
        // Log API access to database
        try {
            await ApiLog.create({
                userId: req.apiUser.id,
                endpoint: req.originalUrl.split("?")[0],
                query_params: Object.keys(req.query).length > 0
                    ? JSON.stringify(req.query)
                    : null,
                statusCode: statusCode,
                timestamp: new Date(),
            });
        } catch (logError) {
            console.error("Failed to log API access:", logError.message);
        }
    }
};

/**
 * GET /api/anime/:id
 * 
 * Fetches full anime details from Jikan API.
 * 
 * Params:
 *   - id: MAL anime ID (required)
 * 
 * Example: GET /api/anime/20
 */
const getAnimeById = async (req, res) => {
    let statusCode = 500;

    try {
        const { id } = req.params;

        if (!id) {
            statusCode = 400;
            return res.status(400).json({
                success: false,
                message: "Anime ID is required",
            });
        }

        // Call Jikan API for full anime details
        const jikanResponse = await axios.get(`${JIKAN_BASE_URL}/anime/${id}/full`);
        statusCode = jikanResponse.status;

        res.status(200).json(jikanResponse.data);
    } catch (error) {
        console.error("Jikan API error (anime detail):", error.message);

        if (error.response) {
            statusCode = error.response.status;
            return res.status(error.response.status).json({
                success: false,
                message: "Jikan API error",
                error: error.response.data,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch anime details",
        });
    } finally {
        try {
            await ApiLog.create({
                userId: req.apiUser.id,
                endpoint: req.originalUrl.split("?")[0],
                query_params: null,
                statusCode: statusCode,
                timestamp: new Date(),
            });
        } catch (logError) {
            console.error("Failed to log API access:", logError.message);
        }
    }
};

module.exports = {
    searchAnime,
    searchManga,
    getAnimeById,
};
