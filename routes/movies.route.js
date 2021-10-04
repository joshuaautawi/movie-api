const router = require("express").Router();
const MovieController = require("../controllers/movieController");
const { protect, authorize } = require("../middleware/auth");


router.get("/", MovieController.findAllMovie);
router.get("/:_id", MovieController.findMovieById);
router.get("/title/:title", MovieController.findMovieByTitle);
// router.get("/genre/:genre", MovieController.findByGenre);
router.get("/show/genre",MovieController.findByGenre)
router.get("/find/genre", MovieController.findAllGenre);
router.get("/character/:_id", MovieController.findCharacterById);
router.get("/overview/:_id", MovieController.findOverviewById);
router.get("/watchlist/find",MovieController.showUserWatchlist)
router.post("/", protect, authorize("admin"), MovieController.createMovie);
router.post('/bulkupload',MovieController.uploadFile) // ini buat upload data awal , comment after upload
router.delete(
  "/:_id",
  protect,
  authorize("admin"),
  MovieController.deleteMovieById
);
router.post("/watchlist/:_id",MovieController.updateWatchlist)
router.patch(
  "/:_id",
  protect,
  authorize("admin"),
  MovieController.updateMovieById
);

module.exports = router;
