const asyncHandler =
  require("../middlewares/asyncHandler");

const Product =
  require("../models/Product");

const Listing =
  require("../models/Listing");

const User =
  require("../models/User");

const getAdminStats =
  asyncHandler(async (req, res) => {
    const totalProducts =
      await Product.countDocuments();

    const totalListings =
      await Listing.countDocuments();

    const totalUsers =
      await User.countDocuments();

    const totalSellers =
      await User.countDocuments({
        role: "local_seller",
      });

    res.status(200).json({
      totalProducts,
      totalListings,
      totalUsers,
      totalSellers,
    });
  });

module.exports = {
  getAdminStats,
};