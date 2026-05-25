const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  createListing,
  getProductListings,
  getSellerListings,
  deleteListing,
} = require("../controllers/listingController");

router.post(
  "/",
  protect,
  createListing
);

router.get(
  "/my-listings",
  protect,
  getSellerListings
);

router.delete(
  "/:id",
  protect,
  deleteListing
);

router.get(
  "/product/:productId",
  getProductListings
);

module.exports = router;