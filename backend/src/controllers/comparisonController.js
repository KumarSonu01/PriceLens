const asyncHandler =
  require("../middlewares/asyncHandler");

const Product =
  require("../models/Product");

const Listing =
  require("../models/Listing");

const compareProducts =
  asyncHandler(async (req, res) => {
    const ids =
      req.query.ids?.split(
        ","
      ) || [];

    if (ids.length < 2) {
      res.status(400);

      throw new Error(
        "Select at least 2 products"
      );
    }

    const products =
      await Product.find({
        _id: { $in: ids },
      });

    const productsWithListings =
      await Promise.all(
        products.map(
          async (
            product
          ) => {
            const listings =
              await Listing.find(
                {
                  product:
                    product._id,
                }
              );

            const lowestPrice =
              listings.length
                ? Math.min(
                    ...listings.map(
                      (l) =>
                        l.price
                    )
                  )
                : null;

            return {
              ...product.toObject(),
              lowestPrice,
            };
          }
        )
      );

    const allSpecs = [
      ...new Set(
        productsWithListings.flatMap(
          (product) =>
            Object.keys(
              product.specifications ||
                {}
            )
        )
      ),
    ];

    const comparisonRows =
      allSpecs.map(
        (spec) => ({
          spec,

          values:
            productsWithListings.map(
              (product) =>
                product
                  .specifications?.[
                  spec
                ] || "-"
            ),
        })
      );

    res.status(200).json({
      products:
        productsWithListings,

      comparisonRows,
    });
  });

module.exports = {
  compareProducts,
};