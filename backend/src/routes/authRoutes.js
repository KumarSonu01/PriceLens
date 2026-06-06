const express =
  require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middlewares/authMiddleware");

const validate =
  require("../middlewares/validateMiddleware");

const {
  registerSchema,
  loginSchema,
} = require("../validators/authValidator");

const router =
  express.Router();

router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);

router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json(req.user);
  }
);

router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports =
  router;