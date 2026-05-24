const Joi = require("joi");

const sellerSchema = Joi.object({
  shopName: Joi.string().required(),

  shopDescription: Joi.string().allow(""),

  phone: Joi.string().required(),

  address: Joi.string().required(),

  city: Joi.string().required(),
});

module.exports = {
  sellerSchema,
};