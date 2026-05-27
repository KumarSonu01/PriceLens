const express = require("express");

const router =
  express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  createListing,
  getProductListings,
  getSellerListings,
  updateListing,
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

router.get(
  "/product/:productId",
  getProductListings
);

router.put(
  "/:id",
  protect,
  updateListing
);

router.delete(
  "/:id",
  protect,
  deleteListing
);

module.exports = router;