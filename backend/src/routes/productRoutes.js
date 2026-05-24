const express = require("express");

const {
  createProduct,
  getProducts,
  getSingleProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");

const validate = require("../middlewares/validateMiddleware");

const {
  productSchema,
} = require("../validators/productValidator");

const router = express.Router();

router.post(
  "/",
  protect,
  validate(productSchema),
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

module.exports = router;