const asyncHandler = require("../middlewares/asyncHandler");

const PriceAlert = require("../models/PriceAlert");

const Product = require("../models/Product");

const createPriceAlert =
  asyncHandler(async (req, res) => {
    const {
      productId,
      targetPrice,
    } = req.body;

    if (
      !productId ||
      !targetPrice
    ) {
      res.status(400);

      throw new Error(
        "Product and target price are required"
      );
    }

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

    const existingAlert =
      await PriceAlert.findOne({
        user: req.user._id,

        product: productId,

        targetPrice,
      });

    if (existingAlert) {
      res.status(400);

      throw new Error(
        "Alert already exists"
      );
    }

    const alert =
      await PriceAlert.create({
        user: req.user._id,

        product: productId,

        targetPrice,
      });

    res.status(201).json(
      alert
    );
  });

const getUserAlerts =
  asyncHandler(async (req, res) => {
    const alerts =
      await PriceAlert.find({
        user: req.user._id,
      })
        .populate(
          "product",
          "title images brand"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      alerts
    );
  });

const deletePriceAlert =
  asyncHandler(async (req, res) => {
    const alert =
      await PriceAlert.findById(
        req.params.id
      );

    if (!alert) {
      res.status(404);

      throw new Error(
        "Alert not found"
      );
    }

    if (
      alert.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    await alert.deleteOne();

    res.status(200).json({
      message:
        "Alert deleted successfully",
    });
  });

module.exports = {
  createPriceAlert,

  getUserAlerts,

  deletePriceAlert,
};