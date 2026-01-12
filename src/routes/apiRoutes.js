const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");

router.use(apiKeyMiddleware);

router.get("/anime", animeController.searchAnime);

router.get("/anime/:id", animeController.getAnimeById);

router.get("/manga", animeController.searchManga);

router.get("/manga/:id", animeController.getMangaById);

module.exports = router;
