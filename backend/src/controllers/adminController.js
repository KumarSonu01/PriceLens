const asyncHandler =
  require("../middlewares/asyncHandler");

const Product =
  require("../models/Product");

const Listing =
  require("../models/Listing");

const PriceHistory =
  require("../models/PriceHistory");

const User =
  require("../models/User");

const createSlug =
  require("../utils/slugify");

const scrapeFlipkartProduct =
  require("../scrapers/flipkartScraper");

const scrapeAmazonProduct =
  require("../scrapers/amazonScraper");

const findMatchingProduct =
  require(
    "../utils/findMatchingProduct"
  );

const getAdminStats =
  asyncHandler(async (req, res) => {
    const totalProducts =
      await Product.countDocuments();

    const totalListings =
      await Listing.countDocuments();

    const totalUsers =
      await User.countDocuments();

    const totalSellers =
      await User.countDocuments({
        role: "local_seller",
      });

    res.status(200).json({
      totalProducts,
      totalListings,
      totalUsers,
      totalSellers,
    });
  });

const importFlipkartProduct =
  asyncHandler(async (req, res) => {
    const { url } = req.body;

    if (!url) {
      res.status(400);

      throw new Error(
        "Product URL is required"
      );
    }

    const scrapedData =
      await scrapeFlipkartProduct(
        url
      );

    const slug =
      createSlug(
        scrapedData.title
      );

    let product =
      await Product.findOne({
        slug,
      });

      if (!product) {
        product =
        await findMatchingProduct(
          scrapedData.title,
          scrapedData.brand
        );
    }

    if (!product) {
      product =
        await Product.create({
          title:
            scrapedData.title,

          slug,

          brand:
            scrapedData.brand,

          category:
            scrapedData.category,

          description:
            scrapedData.description,

          images:
            scrapedData.images,

          overallRating:
            scrapedData.rating,
        });
    }

    let listing =
      await Listing.findOne({
        product:
          product._id,

        source:
          "Flipkart",
      });

    if (!listing) {
      listing =
        await Listing.create({
          product:
            product._id,

          source:
            "Flipkart",

          seller: null,

          price:
            scrapedData.price,

          stock: true,

          productUrl:
            scrapedData.productUrl,

          rating:
            scrapedData.rating,

          reviewsCount:
            scrapedData.reviewsCount,

          images:
            scrapedData.images,

          offer: "NA",

          isScraped: true,

          scrapedAt:
            new Date(),
        });

      await PriceHistory.create({
        product:
          product._id,

        listing:
          listing._id,

        price:
          scrapedData.price,
      });
    }

    res.status(200).json({
      success: true,
      product,
      listing,
    });
  });

const refreshProductPrice =
  asyncHandler(async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      res.status(404);

      throw new Error(
        "Product not found"
      );
    }

    const listing =
      await Listing.findOne({
        product:
          product._id,

        source:
          "Flipkart",
      });

    if (!listing) {
      res.status(404);

      throw new Error(
        "Flipkart listing not found"
      );
    }

    const scrapedData =
      await scrapeFlipkartProduct(
        listing.productUrl
      );

    const oldPrice =
      listing.price;

    listing.price =
      scrapedData.price;

    listing.rating =
      scrapedData.rating;

    listing.reviewsCount =
      scrapedData.reviewsCount;

    listing.images =
      scrapedData.images;

    listing.scrapedAt =
      new Date();

    await listing.save();

    if (
      oldPrice !==
      scrapedData.price
    ) {
      await PriceHistory.create({
        product:
          product._id,

        listing:
          listing._id,

        price:
          scrapedData.price,
      });
    }

    res.status(200).json({
      success: true,
      oldPrice,
      newPrice:
        scrapedData.price,
      listing,
    });
  });

  const importAmazonProduct =
    asyncHandler(async (req, res) => {
    const { url } = req.body;

    if (!url) {
      res.status(400);

      throw new Error(
        "Product URL is required"
      );
    }

    const scrapedData =
      await scrapeAmazonProduct(
        url
      );

    const slug =
      createSlug(
        scrapedData.title
      );

    let product =
  await Product.findOne({
    slug,
  });

  if (!product) {
    product =
    await findMatchingProduct(
      scrapedData.title,
      scrapedData.brand
    );
  }

if (!product) {
  product =
    await Product.create({
      title:
        scrapedData.title,

      slug,

      brand:
        scrapedData.brand ||
        "Amazon",

      category:
        scrapedData.category ||
        "General",

      description:
        scrapedData.description ||
        "",

      images:
        scrapedData.images,

      overallRating:
        scrapedData.rating ||
        0,
        });
    }

    let listing =
      await Listing.findOne({
        product:
          product._id,

        source:
          "Amazon",
      });

    if (!listing) {
      listing =
        await Listing.create({
          product:
            product._id,

          source:
            "Amazon",

          seller: null,

          price:
            scrapedData.price,

          stock: true,

          productUrl:
            scrapedData.productUrl,

          rating:
            scrapedData.rating ||
            0,

          reviewsCount:
            scrapedData.reviewsCount ||
            0,

          images:
            scrapedData.images,

          offer: "NA",

          isScraped: true,

          scrapedAt:
            new Date(),
        });

      await PriceHistory.create({
        product:
          product._id,

        listing:
          listing._id,

        price:
          scrapedData.price,
      });
    }

    res.status(200).json({
      success: true,
      product,
      listing,
    });
  });

module.exports = {
  getAdminStats,
  importFlipkartProduct,
  refreshProductPrice,
  importAmazonProduct,
};