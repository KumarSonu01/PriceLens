const express = require("express");

const router =
  express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const authorizeRoles =
  require("../middlewares/roleMiddleware");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  getPriceHistory,
  getRelatedProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.post(
  "/",
  protect,
  authorizeRoles(
    "admin"
  ),
  createProduct
);

router.get(
  "/",
  getProducts
);

router.get(
  "/:id/price-history",
  getPriceHistory
);

router.get(
  "/:id/related",
  getRelatedProducts
);

router.get(
  "/:id",
  getSingleProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles(
    "admin"
  ),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "admin"
  ),
  deleteProduct
);

module.exports = router;