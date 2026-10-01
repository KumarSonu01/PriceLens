const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} =
  require(
    "../middlewares/authMiddleware"
  );

const {
  createPriceAlert,
  getUserAlerts,
  deletePriceAlert,
} =
  require(
    "../controllers/priceAlertController"
  );


// ==========================================
// CREATE ALERT
// ==========================================

router.post(
  "/",
  protect,
  createPriceAlert
);


// ==========================================
// GET USER ALERTS
// ==========================================

router.get(
  "/my-alerts",
  protect,
  getUserAlerts
);


// ==========================================
// DELETE ALERT
// ==========================================

router.delete(
  "/:id",
  protect,
  deletePriceAlert
);


module.exports =
  router;