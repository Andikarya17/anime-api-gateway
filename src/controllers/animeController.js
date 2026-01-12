const axios = require("axios");
const { ApiLog } = require("../models");

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

const searchAnime = async (req, res) => {
    let statusCode = 500;

    try {
        const { q } = req.query;

        if (!q) {
            statusCode = 400;
            return res.status(400).json({
                success: false,
                message: "Query parameter 'q' is required",
            });
        }

        const jikanResponse = await axios.get(`${JIKAN_BASE_URL}/anime`, {
            params: { q },
        });

        statusCode = jikanResponse.status;

        res.status(200).json(jikanResponse.data);
    } catch (error) {
        console.error("Jikan API error:", error.message);

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

const searchManga = async (req, res) => {
    let statusCode = 500;

    try {
        const { q } = req.query;

        if (!q) {
            statusCode = 400;
            return res.status(400).json({
                success: false,
                message: "Query parameter 'q' is required",
            });
        }

        const jikanResponse = await axios.get(`${JIKAN_BASE_URL}/manga`, {
            params: { q },
        });

        statusCode = jikanResponse.status;

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

const getMangaById = async (req, res) => {
    let statusCode = 500;

    try {
        const { id } = req.params;

        if (!id) {
            statusCode = 400;
            return res.status(400).json({
                success: false,
                message: "Manga ID is required",
            });
        }

        const jikanResponse = await axios.get(`${JIKAN_BASE_URL}/manga/${id}/full`);
        statusCode = jikanResponse.status;

        res.status(200).json(jikanResponse.data);
    } catch (error) {
        console.error("Jikan API error (manga detail):", error.message);

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
            message: "Failed to fetch manga details",
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
    getMangaById,
};
