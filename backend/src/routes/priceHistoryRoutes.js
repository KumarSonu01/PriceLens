const express =
  require("express");

const {
  getPriceHistory,
} = require(
  "../controllers/priceHistoryController"
);

const router =
  express.Router();

router.get(
  "/:productId",
  getPriceHistory
);

module.exports =
  router;