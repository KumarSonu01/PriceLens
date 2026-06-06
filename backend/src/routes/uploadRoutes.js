const express =
  require("express");

const router =
  express.Router();

const upload =
  require("../middlewares/uploadMiddleware");

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

const {
  uploadAvatar,
  removeAvatar,
} = require(
  "../controllers/uploadController"
);

router.post(
  "/avatar",
  protect,
  upload.single("image"),
  uploadAvatar
);

router.delete(
  "/avatar",
  protect,
  removeAvatar
);

module.exports =
  router;