const router = require('express').Router()
const reviewController = require('../controllers/reviewController')
const { protect , authorize} = require('../middleware/auth')

router.post("/:movieId", protect, reviewController.createReview);
router.get("/:movieId", reviewController.readAllReview);
router.patch('/:_id',protect,reviewController.updateUserReview)
router.delete('/:_id',protect,reviewController.deleteUserReview)



module.exports = router