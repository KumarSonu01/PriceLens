const asyncHandler = require("../middlewares/asyncHandler");

const Seller = require("../models/Seller");

const User = require("../models/User");

const createSellerProfile = asyncHandler(async (req, res) => {
  const { shopName, shopDescription, phone, address, city } = req.body;

  const existingSeller = await Seller.findOne({
    user: req.user._id,
  });

  if (existingSeller) {
    res.status(400);

    throw new Error("Seller profile already exists");
  }

  const seller = await Seller.create({
    user: req.user._id,
    shopName,
    shopDescription,
    phone,
    address,
    city,
  });

  await User.findByIdAndUpdate(req.user._id, {
    role: "seller",
  });

  res.status(201).json(seller);
});

const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({
    user: req.user._id,
  }).populate("user", "name email role");

  if (!seller) {
    res.status(404);

    throw new Error("Seller profile not found");
  }

  res.status(200).json(seller);
});

module.exports = {
  createSellerProfile,
  getSellerProfile,
};