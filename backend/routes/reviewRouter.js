const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

/**
 * Public read: supports both
 * - GET /api/v1/reviews (all reviews, optional query filters)
 * - GET /api/v1/tours/:tourId/reviews (reviews for one tour)
 */
router.get("/", reviewController.getAllReviews);

router.use(authController.protect);

router.post(
  "/",
  reviewController.setTourUserIds,
  authController.restrictTo("user"),
  reviewController.createReview,
);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview,
  );
module.exports = router;
