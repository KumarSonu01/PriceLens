const Joi = require("joi");

const registerSchema =
  Joi.object({
    name:
      Joi.string()
        .min(2)
        .required(),

    email:
      Joi.string()
        .email()
        .required(),

    password:
      Joi.string()
        .min(6)
        .required(),

    role:
      Joi.string().valid(
        "buyer",
        "online_seller",
        "local_seller",
        "admin"
      ),

    avatar:
      Joi.string().allow(""),

    adminSecretKey:
      Joi.string().allow(""),

    shopName:
      Joi.string().allow(""),

    shopAddress:
      Joi.string().allow(""),

    city:
      Joi.string().allow(""),

    phone:
      Joi.string().allow(""),

    deliveryRadius:
      Joi.alternatives()
        .try(
          Joi.string(),
          Joi.number()
        )
        .allow(""),
  });

const loginSchema =
  Joi.object({
    email:
      Joi.string()
        .email()
        .required(),

    password:
      Joi.string()
        .required(),
  });

module.exports = {
  registerSchema,

  loginSchema,
};