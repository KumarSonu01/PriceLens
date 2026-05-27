const express = require("express");

const router =
  express.Router();

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  createPriceAlert,
  getUserAlerts,
  deletePriceAlert,
} = require("../controllers/priceAlertController");

router.post(
  "/",
  protect,
  createPriceAlert
);

router.get(
  "/",
  protect,
  getUserAlerts
);

router.delete(
  "/:id",
  protect,
  deletePriceAlert
);

module.exports = router;