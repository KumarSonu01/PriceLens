const express = require("express");

const router =
  express.Router();

const authorizeRoles =
  require("../middlewares/roleMiddleware");

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
  authorizeRoles(
    "online_seller",
    "local_seller"
  ),
  createListing
);

router.get(
  "/my-listings",
  protect,
  authorizeRoles(
    "online_seller",
    "local_seller"
  ),
  getSellerListings
);

router.get(
  "/product/:productId",
  getProductListings
);

router.put(
  "/:id",
  protect,
  authorizeRoles(
    "online_seller",
    "local_seller"
  ),
  updateListing
);

router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "online_seller",
    "local_seller"
  ),
  deleteListing
);

module.exports = router;