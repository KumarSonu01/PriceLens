const asyncHandler =
  require("../middlewares/asyncHandler");

const PriceHistory =
  require("../models/PriceHistory");

const getPriceHistory =
  asyncHandler(async (req, res) => {
    const history =
      await PriceHistory.find({
        product:
          req.params.productId,
      })
        .sort({
          createdAt: 1,
        })
        .select(
          "price createdAt"
        );

    res.status(200).json(
      history
    );
  });

module.exports = {
  getPriceHistory,
};