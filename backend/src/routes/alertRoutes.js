const controller =
  require(
    "../controllers/alertController"
  );

console.log(controller);

const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const {
  createAlert,
  getMyAlerts,
  deleteAlert,
} = require(
  "../controllers/alertController"
);

router.post(
  "/",
  protect,
  createAlert
);

router.get(
  "/my-alerts",
  protect,
  getMyAlerts
);

router.delete(
  "/:id",
  protect,
  deleteAlert
);

module.exports =
  router;