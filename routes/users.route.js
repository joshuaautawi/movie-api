const router = require("express").Router();
const { register, login, getMe, updateDetails } = require("../controllers/usersController");
const { protect } = require("../middleware/auth");


router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);

module.exports = router;
