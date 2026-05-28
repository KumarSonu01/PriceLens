const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,

      enum: [
        "buyer",
        "online_seller",
        "local_seller",
        "admin",
      ],

      default: "buyer",
    },

    avatar: {
      type: String,
      default: "",
    },

    shopName: {
      type: String,
      default: "",
      trim: true,
    },

    shopAddress: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    deliveryRadius: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;