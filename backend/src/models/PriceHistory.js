const mongoose = require("mongoose");

const priceHistorySchema =
  new mongoose.Schema(
    {
      product: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true,
      },

      listing: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Listing",

        required: true,
      },

      price: {
        type: Number,

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const PriceHistory =
  mongoose.model(
    "PriceHistory",
    priceHistorySchema
  );

module.exports =
  PriceHistory;