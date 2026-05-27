const asyncHandler = require("../middlewares/asyncHandler");

const Listing = require("../models/Listing");

const PriceHistory = require("../models/PriceHistory");

const PriceAlert = require("../models/PriceAlert");

const triggerPriceAlerts =
  async (productId, price) => {
    const alerts =
      await PriceAlert.find({
        product: productId,

        isTriggered: false,

        targetPrice: {
          $gte: price,
        },
      });

    for (const alert of alerts) {
      alert.isTriggered = true;

      await alert.save();
    }
  };

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

    await triggerPriceAlerts(
      product,
      price
    );

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
          "name email"
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

      await triggerPriceAlerts(
        listing.product,
        req.body.price
      );
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

    if (
      listing.seller.toString() !==
      req.user._id.toString()
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

  updateListing,

  deleteListing,
};