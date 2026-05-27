const express = require("express");

const router =
  express.Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  getPriceHistory,
} = require("../controllers/productController");

router.post(
  "/",
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
  "/:id",
  getSingleProduct
);

module.exports = router;