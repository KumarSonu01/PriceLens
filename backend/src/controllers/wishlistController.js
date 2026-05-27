const asyncHandler = require("../middlewares/asyncHandler");

const Wishlist = require("../models/Wishlist");

const Product = require("../models/Product");

const addToWishlist =
  asyncHandler(async (req, res) => {
    const { productId } =
      req.body;

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      res.status(404);

      throw new Error(
        "Product not found"
      );
    }

    const existingWishlist =
      await Wishlist.findOne({
        user: req.user._id,

        product: productId,
      });

    if (existingWishlist) {
      res.status(400);

      throw new Error(
        "Product already in wishlist"
      );
    }

    const wishlist =
      await Wishlist.create({
        user: req.user._id,

        product: productId,
      });

    res.status(201).json(
      wishlist
    );
  });

const getWishlist =
  asyncHandler(async (req, res) => {
    const wishlist =
      await Wishlist.find({
        user: req.user._id,
      }).populate(
        "product"
      );

    res.status(200).json(
      wishlist
    );
  });

const removeFromWishlist =
  asyncHandler(async (req, res) => {
    const wishlist =
      await Wishlist.findById(
        req.params.id
      );

    if (!wishlist) {
      res.status(404);

      throw new Error(
        "Wishlist item not found"
      );
    }

    if (
      wishlist.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    await wishlist.deleteOne();

    res.status(200).json({
      message:
        "Removed from wishlist",
    });
  });

module.exports = {
  addToWishlist,

  getWishlist,

  removeFromWishlist,
};