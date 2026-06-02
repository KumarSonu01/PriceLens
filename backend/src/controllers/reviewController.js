const asyncHandler =
  require("../middlewares/asyncHandler");

const Review =
  require("../models/Review");

const Product =
  require("../models/Product");

const updateProductRating =
  async (productId) => {
    const reviews =
      await Review.find({
        product: productId,
      });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce(
            (
              total,
              review
            ) =>
              total +
              review.rating,
            0
          ) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(
      productId,
      {
        overallRating:
          averageRating,
      }
    );
  };

const createReview =
  asyncHandler(async (req, res) => {
    const {
      productId,
      rating,
      comment,
    } = req.body;

    const existingReview =
      await Review.findOne({
        product:
          productId,

        user:
          req.user._id,
      });

    if (existingReview) {
      res.status(400);

      throw new Error(
        "You have already reviewed this product"
      );
    }

    const review =
      await Review.create({
        product:
          productId,

        user:
          req.user._id,

        rating,

        comment,
      });

    await updateProductRating(
      productId
    );

    res.status(201).json(
      review
    );
  });

const getProductReviews =
  asyncHandler(async (req, res) => {
    const reviews =
      await Review.find({
        product:
          req.params.productId,
      })
        .populate(
          "user",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      reviews
    );
  });

const deleteReview =
  asyncHandler(async (req, res) => {
    const review =
      await Review.findById(
        req.params.id
      );

    if (!review) {
      res.status(404);

      throw new Error(
        "Review not found"
      );
    }

    const isOwner =
      review.user.toString() ===
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

    const productId =
      review.product;

    await review.deleteOne();

    await updateProductRating(
      productId
    );

    res.status(200).json({
      message:
        "Review deleted successfully",
    });
  });

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};