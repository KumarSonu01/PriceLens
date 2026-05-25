const asyncHandler = require("../middlewares/asyncHandler");

const Product = require("../models/Product");

const Listing = require("../models/Listing");

const createSlug = require("../utils/slugify");

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    brand,
    category,
    description,
    specifications,
    features,
    images,
  } = req.body;

  const slug = createSlug(title);

  const existingProduct = await Product.findOne({
    slug,
  });

  if (existingProduct) {
    res.status(400);

    throw new Error("Product already exists");
  }

  const product = await Product.create({
    title,
    slug,
    brand,
    category,
    description,
    specifications,
    features,
    images,
  });

  res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    brand,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (keyword) {
    query.title = {
      $regex: keyword,
      $options: "i",
    };
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = brand;
  }

  let products = await Product.find(query);

  const productsWithPrices =
    await Promise.all(
      products.map(async (product) => {
        const listing = await Listing.findOne({
          product: product._id,
        }).sort({ price: 1 });

        return {
          ...product.toObject(),
          lowestPrice: listing
            ? listing.price
            : null,
        };
      })
    );

  if (sort === "latest") {
    productsWithPrices.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }

  if (sort === "rating") {
    productsWithPrices.sort(
      (a, b) =>
        b.overallRating - a.overallRating
    );
  }

  if (sort === "priceLow") {
    productsWithPrices.sort(
      (a, b) =>
        (a.lowestPrice || Infinity) -
        (b.lowestPrice || Infinity)
    );
  }

  if (sort === "priceHigh") {
    productsWithPrices.sort(
      (a, b) =>
        (b.lowestPrice || 0) -
        (a.lowestPrice || 0)
    );
  }

  const skip = (page - 1) * limit;

  const paginatedProducts =
    productsWithPrices.slice(
      skip,
      skip + Number(limit)
    );

  res.status(200).json({
    totalProducts: products.length,
    currentPage: Number(page),
    totalPages: Math.ceil(
      products.length / limit
    ),
    products: paginatedProducts,
  });
});

const getSingleProduct = asyncHandler(
  async (req, res) => {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      res.status(404);

      throw new Error("Product not found");
    }

    res.status(200).json(product);
  }
);

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
};