const express = require("express");

const router =
  express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  checkWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.post(
  "/",
  protect,
  addToWishlist
);

router.get(
  "/",
  protect,
  getWishlist
);

router.get(
  "/check/:productId",
  protect,
  checkWishlist
);

router.delete(
  "/:id",
  protect,
  removeFromWishlist
);

module.exports = router;