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

module.exports = {
  getAdminStats,
  importFlipkartProduct,
};