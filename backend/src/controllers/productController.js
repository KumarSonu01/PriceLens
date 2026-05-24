const asyncHandler = require("../middlewares/asyncHandler");

const Product = require("../models/Product");

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

  const existingProduct = await Product.findOne({ slug });

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

  let sortOption = {};

  if (sort === "latest") {
    sortOption.createdAt = -1;
  }

  if (sort === "rating") {
    sortOption.overallRating = -1;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(query);

  res.status(200).json({
    totalProducts,
    currentPage: Number(page),
    totalPages: Math.ceil(totalProducts / limit),
    products,
  });
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
};