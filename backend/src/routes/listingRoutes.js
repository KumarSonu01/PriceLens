const express = require("express");

const {
  createListing,
  getProductListings,
} = require("../controllers/listingController");

const { protect } = require("../middlewares/authMiddleware");

const validate = require("../middlewares/validateMiddleware");

const {
  listingSchema,
} = require("../validators/listingValidator");

const router = express.Router();

router.post(
  "/",
  protect,
  validate(listingSchema),
  createListing
);

router.get(
  "/product/:productId",
  getProductListings
);

module.exports = router;