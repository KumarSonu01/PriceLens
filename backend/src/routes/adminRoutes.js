const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const authorizeRoles =
  require("../middlewares/roleMiddleware");

const {
  getAdminStats,
  importFlipkartProduct,
  refreshProductPrice,
} = require(
  "../controllers/adminController"
);

router.get(
  "/stats",
  protect,
  authorizeRoles(
    "admin"
  ),
  getAdminStats
);

router.post(
  "/import/flipkart",
  protect,
  authorizeRoles(
    "admin"
  ),
  importFlipkartProduct
);

router.post(
  "/refresh-product/:id",
  protect,
  authorizeRoles(
    "admin"
  ),
  refreshProductPrice
);

module.exports =
  router;