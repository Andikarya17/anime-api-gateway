const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes in this file require JWT authentication
router.use(authMiddleware);

// GET /api/anime?q={query} - Search anime via Jikan API
router.get("/anime", animeController.searchAnime);

module.exports = router;
