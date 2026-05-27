const mongoose = require("mongoose");

const listingSchema =
  new mongoose.Schema(
    {
      product: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true,
      },

      source: {
        type: String,

        required: true,

        enum: [
          "amazon",
          "flipkart",
          "blinkit",
          "zepto",
          "local",
        ],
      },

      seller: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null,
      },

      price: {
        type: Number,

        required: true,
      },

      stock: {
        type: Boolean,

        default: true,
      },

      deliveryInfo: {
        type: String,

        default: "",
      },

      productUrl: {
        type: String,

        default: "",
      },

      rating: {
        type: Number,

        default: 0,
      },

      reviewsCount: {
        type: Number,

        default: 0,
      },

      images: {
        type: [String],

        default: [],
      },

      offer: {
        type: String,

        default: "NA",
      },
    },
    {
      timestamps: true,
    }
  );

listingSchema.index(
  {
    product: 1,

    source: 1,

    seller: 1,
  },
  {
    unique: true,
  }
);


const Listing =
  mongoose.model(
    "Listing",
    listingSchema
  );

module.exports = Listing;