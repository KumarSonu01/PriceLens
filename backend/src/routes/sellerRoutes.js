const express = require("express");

const {
  createSellerProfile,
  getSellerProfile,
} = require("../controllers/sellerController");

const { protect } = require("../middlewares/authMiddleware");

const validate = require("../middlewares/validateMiddleware");

const {
  sellerSchema,
} = require("../validators/sellerValidator");

const router = express.Router();

router.post(
  "/",
  protect,
  validate(sellerSchema),
  createSellerProfile
);

router.get(
  "/profile",
  protect,
  getSellerProfile
);

module.exports = router;