const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const asyncHandler = require("../middlewares/asyncHandler");

const isValidEmail =
  (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  };

const registerUser =
  asyncHandler(async (req, res) => {
    const {
      name,
      email,
      password,
      role,
      avatar,
      adminSecretKey,
      shopName,
      shopAddress,
      city,
      phone,
      deliveryRadius,
    } = req.body;

    if (!isValidEmail(email)) {
      res.status(400);

      throw new Error(
        "Invalid email format"
      );
    }

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      res.status(400);

      throw new Error(
        "User already exists"
      );
    }

    if (role === "admin") {
      if (
        adminSecretKey !==
        process.env.ADMIN_SECRET_KEY
      ) {
        res.status(403);

        throw new Error(
          "Invalid admin secret key"
        );
      }
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,

        email,

        password:
          hashedPassword,

        role:
          role || "buyer",

        avatar,

        shopName,

        shopAddress,

        city,

        phone,

        deliveryRadius,
      });

    res.status(201).json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      avatar: user.avatar,

      shopName:
        user.shopName,

      city: user.city,

      token: generateToken(
        user._id
      ),
    });
  });

const loginUser =
  asyncHandler(async (req, res) => {
    const { email, password } =
      req.body;

    if (!isValidEmail(email)) {
      res.status(400);

      throw new Error(
        "Invalid email format"
      );
    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      res.status(401);

      throw new Error(
        "Invalid credentials"
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      res.status(401);

      throw new Error(
        "Invalid credentials"
      );
    }

    res.status(200).json({
      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      avatar: user.avatar,

      shopName:
        user.shopName,

      city: user.city,

      token: generateToken(
        user._id
      ),
    });
  });

module.exports = {
  registerUser,

  loginUser,
};