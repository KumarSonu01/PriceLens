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
  getSellerStats,
  getAllListings,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

router.post(
  "/",
  protect,
  authorizeRoles(
    "local_seller"
  ),
  createListing
);

router.get(
  "/my-listings",
  protect,
  authorizeRoles(
    "local_seller"
  ),
  getSellerListings
);

router.get(
  "/seller/stats",
  protect,
  authorizeRoles(
    "local_seller"
  ),
  getSellerStats
);

router.get(
  "/admin/all",
  protect,
  authorizeRoles(
    "admin"
  ),
  getAllListings
);

router.get(
  "/product/:productId",
  getProductListings
);

router.put(
  "/:id",
  protect,
  authorizeRoles(
    "local_seller"
  ),
  updateListing
);

router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "local_seller",
    "admin"
  ),
  deleteListing
);

module.exports = router;