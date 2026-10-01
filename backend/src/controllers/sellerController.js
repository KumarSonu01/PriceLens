const asyncHandler =
  require("../middlewares/asyncHandler");

const Seller =
  require("../models/Seller");

const User =
  require("../models/User");


// ==========================================
// CREATE SELLER PROFILE
// ==========================================
const createSellerProfile =
  asyncHandler(async (req, res) => {
    const {
      shopName,
      shopDescription,
      phone,
      address,
      city,
      storeLink,
    } = req.body;

    const existingSeller =
      await Seller.findOne({
        user: req.user._id,
      });

    if (existingSeller) {
      res.status(400);

      throw new Error(
        "Seller profile already exists"
      );
    }

    const seller =
      await Seller.create({
        user: req.user._id,
        shopName,
        shopDescription,
        phone,
        address,
        city,
        storeLink:
          storeLink || "",
      });

    /*
     * User schema uses:
     * buyer
     * local_seller
     * admin
     */
    await User.findByIdAndUpdate(
      req.user._id,
      {
        role: "local_seller",
      }
    );

    res.status(201).json(
      seller
    );
  });


// ==========================================
// GET CURRENT SELLER PROFILE
// ==========================================
const getSellerProfile =
  asyncHandler(async (req, res) => {
    const seller =
      await Seller.findOne({
        user: req.user._id,
      }).populate(
        "user",
        "name email role avatar"
      );

    if (!seller) {
      res.status(404);

      throw new Error(
        "Seller profile not found"
      );
    }

    res.status(200).json(
      seller
    );
  });


// ==========================================
// UPDATE CURRENT SELLER PROFILE
// ==========================================
const updateSellerProfile =
  asyncHandler(async (req, res) => {
    const seller =
      await Seller.findOne({
        user: req.user._id,
      });

    if (!seller) {
      res.status(404);

      throw new Error(
        "Seller profile not found"
      );
    }

    if (
      req.body.shopName !==
      undefined
    ) {
      seller.shopName =
        req.body.shopName;
    }

    if (
      req.body.shopDescription !==
      undefined
    ) {
      seller.shopDescription =
        req.body.shopDescription;
    }

    if (
      req.body.phone !==
      undefined
    ) {
      seller.phone =
        req.body.phone;
    }

    if (
      req.body.address !==
      undefined
    ) {
      seller.address =
        req.body.address;
    }

    if (
      req.body.city !==
      undefined
    ) {
      seller.city =
        req.body.city;
    }

    if (
      req.body.storeLink !==
      undefined
    ) {
      seller.storeLink =
        req.body.storeLink.trim();
    }

    const updatedSeller =
      await seller.save();

    res.status(200).json(
      updatedSeller
    );
  });


module.exports = {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
};