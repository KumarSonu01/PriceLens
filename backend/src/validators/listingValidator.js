const Joi = require("joi");

const listingSchema = Joi.object({
  product: Joi.string().required(),

  source: Joi.string()
    .valid(
      "amazon",
      "flipkart",
      "blinkit",
      "zepto",
      "local"
    )
    .required(),

  price: Joi.number().required(),

  stock: Joi.boolean(),

  deliveryInfo: Joi.string().allow(""),

  productUrl: Joi.string().allow(""),

  rating: Joi.number(),

  reviewsCount: Joi.number(),

  images: Joi.array().items(Joi.string()),

  offers: Joi.array().items(Joi.string()),
});

module.exports = {
  listingSchema,
};