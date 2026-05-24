const asyncHandler = require("../middlewares/asyncHandler");

const Listing = require("../models/Listing");

const Seller = require("../models/Seller");

const Product = require("../models/Product");

const createListing = asyncHandler(async (req, res) => {
  const {
    product,
    source,
    price,
    stock,
    deliveryInfo,
    productUrl,
    rating,
    reviewsCount,
    images,
    offers,
  } = req.body;

  const existingProduct = await Product.findById(product);

  if (!existingProduct) {
    res.status(404);

    throw new Error("Product not found");
  }

  let sellerId = null;

  if (source === "local") {
    const seller = await Seller.findOne({
      user: req.user._id,
    });

    if (!seller) {
      res.status(404);

      throw new Error("Seller profile not found");
    }

    sellerId = seller._id;
  }

  const listing = await Listing.create({
    product,
    source,
    seller: sellerId,
    price,
    stock,
    deliveryInfo,
    productUrl,
    rating,
    reviewsCount,
    images,
    offers,
  });

  res.status(201).json(listing);
});

const getProductListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({
    product: req.params.productId,
  })
    .populate("seller")
    .populate("product");

  res.status(200).json(listings);
});

module.exports = {
  createListing,
  getProductListings,
};