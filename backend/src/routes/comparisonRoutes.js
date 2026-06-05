const express =
  require("express");

const router =
  express.Router();

const {
  compareProducts,
} = require(
  "../controllers/comparisonController"
);

router.get(
  "/",
  compareProducts
);

module.exports =
  router;