const express =
  require("express");

const {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
} = require(
  "../controllers/sellerController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const validate =
  require(
    "../middlewares/validateMiddleware"
  );

const {
  sellerSchema,
} = require(
  "../validators/sellerValidator"
);

const router =
  express.Router();


// Create seller profile
router.post(
  "/",
  protect,
  validate(sellerSchema),
  createSellerProfile
);


// Get current seller profile
router.get(
  "/profile",
  protect,
  getSellerProfile
);


// Update current seller profile
router.put(
  "/profile",
  protect,
  updateSellerProfile
);


module.exports =
  router;