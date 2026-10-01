const Joi = require("joi");

const sellerSchema = Joi.object({
  shopName: Joi.string()
    .trim()
    .required(),

  shopDescription: Joi.string()
    .trim()
    .allow("")
    .default(""),

  phone: Joi.string()
    .trim()
    .required(),

  address: Joi.string()
    .trim()
    .required(),

  city: Joi.string()
    .trim()
    .required(),

  storeLink: Joi.string()
    .uri({
      scheme: [
        "http",
        "https",
      ],
    })
    .allow("")
    .default(""),
});

module.exports = {
  sellerSchema,
};