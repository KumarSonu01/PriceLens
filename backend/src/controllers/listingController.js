const asyncHandler = require("../middlewares/asyncHandler");

const Listing = require("../models/Listing");

const PriceHistory = require("../models/PriceHistory");

const checkPriceAlerts = require("../jobs/checkPriceAlerts");



const createListing =
  asyncHandler(async (req, res) => {
    const {
      product,
      source,
      price,
      deliveryInfo,
      offer,
      stock,
      productUrl,
    } = req.body;

    const existingListing =
      await Listing.findOne({
        product,
        source,
        seller: req.user._id,
      });

    if (existingListing) {
      res.status(400);

      throw new Error(
        "Listing already exists for this product and source"
      );
    }

    const listing =
      await Listing.create({
        seller: req.user._id,
        product,
        source,
        price,
        stock,
        deliveryInfo,
        productUrl,
        offer,
      });

    await PriceHistory.create({
      product,
      listing: listing._id,
      price,
    });

    await checkPriceAlerts();

    res.status(201).json(
      listing
    );
  });

const getProductListings =
  asyncHandler(async (req, res) => {
    const listings =
      await Listing.find({
        product:
          req.params.productId,
      })
        .populate(
          "seller",
          "name email shopName city avatar role"
        )
        .sort({ price: 1 });

    res.status(200).json(
      listings
    );
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

    res.status(200).json(
      listings
    );
  });

const getSellerStats =
  asyncHandler(async (req, res) => {
    const listings =
      await Listing.find({
        seller: req.user._id,
      });

    const totalListings =
      listings.length;

    const activeDeals =
      listings.filter(
        (listing) =>
          listing.offer &&
          listing.offer.trim() !== ""
      ).length;

    const uniqueProducts =
      new Set(
        listings.map(
          (listing) =>
            listing.product.toString()
        )
      );

    res.status(200).json({
      totalProducts:
        uniqueProducts.size,

      totalListings,

      activeDeals,
    });
  });

const getAllListings =
  asyncHandler(async (req, res) => {
    const listings =
      await Listing.find()
        .populate(
          "product",
          "title images"
        )
        .populate(
          "seller",
          "name shopName email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count:
        listings.length,
      listings,
    });
  });

const updateListing =
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

    const oldPrice =
      listing.price;

    listing.price =
      req.body.price ??
      listing.price;

    listing.stock =
      req.body.stock ??
      listing.stock;

    listing.offer =
      req.body.offer ??
      listing.offer;

    listing.deliveryInfo =
      req.body.deliveryInfo ??
      listing.deliveryInfo;

    listing.productUrl =
      req.body.productUrl ??
      listing.productUrl;

    const updatedListing =
      await listing.save();

    if (
      req.body.price &&
      req.body.price !==
        oldPrice
    ) {
      await PriceHistory.create({
        product:
          listing.product,

        listing:
          listing._id,

        price:
          req.body.price,
      });

      await checkPriceAlerts();
    }

    res.status(200).json(
      updatedListing
    );
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

    const isOwner =
      listing.seller.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role ===
      "admin";

    if (
      !isOwner &&
      !isAdmin
    ) {
      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    await PriceHistory.deleteMany({
      listing: listing._id,
    });

    await listing.deleteOne();

    res.status(200).json({
      message:
        "Listing deleted successfully",
    });
  });

module.exports = {
  createListing,
  getProductListings,
  getSellerListings,
  getSellerStats,
  getAllListings,
  updateListing,
  deleteListing,
};