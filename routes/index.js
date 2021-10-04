const express = require("express");
const movieRoute = require("./movies.route");
const reviewRoute = require("./review.route");
const adminRoute = require("./admin.route");
const usersRoute = require("./users.route");
const { authorize , protect } = require("../middleware/auth");
const router = express.Router();

router.use("/movies", movieRoute);
router.use("/review", reviewRoute);
router.use("/admin", protect , authorize("admin"), adminRoute);
router.use("/user", usersRoute);

module.exports = router;
