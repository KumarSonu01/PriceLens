const mongoose = require("mongoose");

const priceAlertSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      product: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      targetPrice: {
        type: Number,
        required: true,
      },

      isTriggered: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "PriceAlert",
    priceAlertSchema
  );