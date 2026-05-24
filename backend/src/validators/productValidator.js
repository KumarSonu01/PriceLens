const Joi = require("joi");

const productSchema = Joi.object({
  title: Joi.string().required(),

  brand: Joi.string().required(),

  category: Joi.string().required(),

  description: Joi.string().allow(""),

  specifications: Joi.object(),

  features: Joi.array().items(Joi.string()),

  images: Joi.array().items(Joi.string()),
});

module.exports = {
  productSchema,
};