const express =
  require("express");

const router =
  express.Router();

const upload =
  require("../middlewares/uploadMiddleware");

const {
  uploadAvatar,
} = require("../controllers/uploadController");

router.post(
  "/avatar",
  upload.single("image"),
  uploadAvatar
);

module.exports =
  router;