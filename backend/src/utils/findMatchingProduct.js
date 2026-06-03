const Product =
  require("../models/Product");

const normalize =
  (text) =>
    text
      .toLowerCase()
      .replace(
        /[^a-z0-9 ]/g,
        " "
      )
      .split(" ")
      .filter(
        (word) =>
          word.length > 2
      );

const findMatchingProduct =
  async (
    title,
    brand
  ) => {
    console.log(
      "Looking for:",
      title
    );

    const products =
      await Product.find({
        brand: {
          $regex: new RegExp(
            brand,
            "i"
          ),
        },
      });

    const newWords =
      normalize(title);

    for (const product of products) {
      const existingWords =
        normalize(
          product.title
        );

      const matches =
        newWords.filter(
          (word) =>
            existingWords.includes(
              word
            )
        );

      console.log(
        "Comparing with:",
        product.title
      );

      console.log(
        "Matched words:",
        matches
      );

      if (
        matches.length >= 6
      ) {
        console.log(
          "Matched:",
          product.title
        );

        return product;
      }
    }

    console.log(
      "No matching product found"
    );

    return null;
  };

module.exports =
  findMatchingProduct;