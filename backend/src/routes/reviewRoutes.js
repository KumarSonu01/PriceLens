const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewController");

router.post(
  "/",
  protect,
  createReview
);

router.get(
  "/product/:productId",
  getProductReviews
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

module.exports = router;