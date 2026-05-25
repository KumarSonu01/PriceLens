const asyncHandler = require("../middlewares/asyncHandler");

const Listing = require("../models/Listing");

const createListing = asyncHandler(
  async (req, res) => {
    const {
      product,
      source,
      price,
      deliveryInfo,
      offer,
    } = req.body;

    const listing =
      await Listing.create({
        seller: req.user._id,
        product,
        source,
        price,
        deliveryInfo,
        offer,
      });

    res.status(201).json(listing);
  }
);

const getProductListings =
  asyncHandler(async (req, res) => {
    const listings =
      await Listing.find({
        product:
          req.params.productId,
      })
        .populate(
          "seller",
          "shopName"
        )
        .sort({ price: 1 });

    res.status(200).json(listings);
  });

const getSellerListings =
  asyncHandler(async (req, res) => {
    const listings =
      await Listing.find({
        seller: req.user._id,
      }).populate(
        "product",
        "title images"
      );

    res.status(200).json(listings);
  });

const deleteListing =
  asyncHandler(async (req, res) => {
    const listing =
      await Listing.findById(
        req.params.id
      );

    if (!listing) {
      res.status(404);

      throw new Error(
        "Listing not found"
      );
    }

    if (
      listing.seller.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    await listing.deleteOne();

    res.status(200).json({
      message:
        "Listing deleted",
    });
  });

module.exports = {
  createListing,
  getProductListings,
  getSellerListings,
  deleteListing,
};