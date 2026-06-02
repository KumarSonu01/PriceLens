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
} = require("../controllers/adminController");

router.get(
  "/stats",
  protect,
  authorizeRoles(
    "admin"
  ),
  getAdminStats
);

module.exports = router;