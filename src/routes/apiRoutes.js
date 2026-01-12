const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");

// ═══════════════════════════════════════════════════════════════════════════
// API GATEWAY ROUTES - Protected by API Key (NOT JWT)
// ═══════════════════════════════════════════════════════════════════════════
// All routes in this file require a valid X-API-Key header.
// This allows external clients (curl, Postman, other apps) to consume the API.
// ═══════════════════════════════════════════════════════════════════════════

router.use(apiKeyMiddleware);

// GET /api/anime?q={query} - Search anime via Jikan API (Gateway)
router.get("/anime", animeController.searchAnime);

// GET /api/anime/:id - Get anime details via Jikan API (Gateway)
router.get("/anime/:id", animeController.getAnimeById);

// GET /api/manga?q={query} - Search manga via Jikan API (Gateway)
router.get("/manga", animeController.searchManga);

module.exports = router;

