const asyncHandler =
  require("../middlewares/asyncHandler");

const Listing =
  require("../models/Listing");

const Seller =
  require("../models/Seller");

const PriceHistory =
  require("../models/PriceHistory");

const checkPriceAlerts =
  require("../jobs/checkPriceAlerts");


// ==========================================
// CREATE LISTING
// ==========================================

const createListing =
  asyncHandler(async (req, res) => {

    const {
      product,
      source,
      price,
      deliveryInfo,
      offer,
      stock,
      productUrl,
    } = req.body;


    // ========================================
    // CHECK DUPLICATE LISTING
    // ========================================

    const existingListing =
      await Listing.findOne({
        product,
        source,
        seller: req.user._id,
      });


    if (existingListing) {

      res.status(400);

      throw new Error(
        "Listing already exists for this product and source"
      );
    }


    // ========================================
    // CREATE LISTING
    // ========================================

    const listing =
      await Listing.create({

        seller:
          req.user._id,

        product,

        source,

        price,

        stock,

        deliveryInfo,

        productUrl,

        offer,
      });


    // ========================================
    // PRICE HISTORY
    // ========================================

    await PriceHistory.create({

      product,

      listing:
        listing._id,

      price,
    });


    // ========================================
    // CHECK PRICE ALERTS
    // ========================================

    await checkPriceAlerts();


    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json(
      listing
    );
  });


// ==========================================
// GET PRODUCT LISTINGS
// ==========================================

const getProductListings =
  asyncHandler(async (req, res) => {

    const listings =
      await Listing.find({
        product:
          req.params.productId,
      })
        .populate(
          "seller",
          "name email shopName city avatar role"
        )
        .sort({
          price: 1,
        });


    /*
     * Get all User IDs belonging to
     * the sellers in these listings.
     */

    const sellerIds =
      listings
        .map(
          (listing) =>
            listing.seller?._id
        )
        .filter(Boolean);


    /*
     * Find Seller documents using
     * their User IDs.
     */

    const sellerProfiles =
      await Seller.find({
        user: {
          $in: sellerIds,
        },
      }).select(
        "user storeLink logo isVerified ratings reviewsCount"
      );


    /*
     * Create:
     *
     * User ID → Seller profile
     */

    const sellerMap =
      new Map(
        sellerProfiles.map(
          (seller) => [
            seller.user.toString(),
            seller,
          ]
        )
      );


    /*
     * Attach seller profile
     * information to listing.
     */

    const enrichedListings =
      listings.map(
        (listing) => {

          const listingObject =
            listing.toObject();


          if (
            listingObject.seller
          ) {

            const sellerId =
              listingObject.seller._id.toString();


            const sellerProfile =
              sellerMap.get(
                sellerId
              );


            listingObject.seller.storeLink =
              sellerProfile?.storeLink ||
              "";


            listingObject.seller.sellerLogo =
              sellerProfile?.logo ||
              "";


            listingObject.seller.isVerified =
              sellerProfile?.isVerified ||
              false;


            listingObject.seller.ratings =
              sellerProfile?.ratings ||
              0;


            listingObject.seller.reviewsCount =
              sellerProfile?.reviewsCount ||
              0;
          }


          return listingObject;
        }
      );


    res.status(200).json(
      enrichedListings
    );
  });


// ==========================================
// GET SELLER LISTINGS
// ==========================================

const getSellerListings =
  asyncHandler(async (req, res) => {

    const listings =
      await Listing.find({
        seller:
          req.user._id,
      })
        .populate(
          "product",
          "title images"
        );


    res.status(200).json(
      listings
    );
  });


// ==========================================
// GET SELLER STATS
// ==========================================

const getSellerStats =
  asyncHandler(async (req, res) => {

    const listings =
      await Listing.find({
        seller:
          req.user._id,
      });


    const totalListings =
      listings.length;


    const activeDeals =
      listings.filter(
        (listing) =>
          listing.offer &&
          listing.offer.trim() !== ""
      ).length;


    const uniqueProducts =
      new Set(
        listings.map(
          (listing) =>
            listing.product.toString()
        )
      );


    res.status(200).json({

      totalProducts:
        uniqueProducts.size,

      totalListings,

      activeDeals,
    });
  });


// ==========================================
// GET ALL LISTINGS
// ==========================================

const getAllListings =
  asyncHandler(async (req, res) => {

    const listings =
      await Listing.find()

        .populate(
          "product",
          "title images"
        )

        .populate(
          "seller",
          "name shopName email"
        )

        .sort({
          createdAt: -1,
        });


    res.status(200).json({

      success: true,

      count:
        listings.length,

      listings,
    });
  });


// ==========================================
// UPDATE LISTING
// ==========================================

const updateListing =
  asyncHandler(async (req, res) => {

    const listing =
      await Listing.findById(
        req.params.id
      );


    // ========================================
    // CHECK LISTING
    // ========================================

    if (!listing) {

      res.status(404);

      throw new Error(
        "Listing not found"
      );
    }


    // ========================================
    // CHECK OWNERSHIP
    // ========================================

    if (
      listing.seller.toString() !==
      req.user._id.toString()
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }


    // ========================================
    // SAVE OLD PRICE
    // ========================================

    const oldPrice =
      Number(
        listing.price
      );


    // ========================================
    // CHECK WHETHER PRICE WAS SENT
    // ========================================

    const priceWasProvided =
      req.body.price !==
      undefined &&
      req.body.price !==
      null &&
      req.body.price !==
      "";


    // ========================================
    // NEW PRICE
    // ========================================

    const newPrice =
      priceWasProvided
        ? Number(
            req.body.price
          )
        : oldPrice;


    // ========================================
    // VALIDATE PRICE
    // ========================================

    if (
      priceWasProvided &&
      (
        Number.isNaN(
          newPrice
        ) ||
        newPrice <= 0
      )
    ) {

      res.status(400);

      throw new Error(
        "Valid price is required"
      );
    }


    // ========================================
    // DETERMINE PRICE CHANGE
    // ========================================

    const priceChanged =
      priceWasProvided &&
      newPrice !== oldPrice;


    // ========================================
    // UPDATE LISTING
    // ========================================

    listing.price =
      newPrice;


    listing.stock =
      req.body.stock ??
      listing.stock;


    listing.offer =
      req.body.offer ??
      listing.offer;


    listing.deliveryInfo =
      req.body.deliveryInfo ??
      listing.deliveryInfo;


    listing.productUrl =
      req.body.productUrl ??
      listing.productUrl;


    // ========================================
    // SAVE LISTING
    // ========================================

    const updatedListing =
      await listing.save();


    // ========================================
    // PRICE CHANGED
    // ========================================

    if (
      priceChanged
    ) {

      console.log(
        "================================="
      );

      console.log(
        "LOCAL SELLER PRICE UPDATED"
      );

      console.log(
        `Listing: ${listing._id}`
      );

      console.log(
        `Old price: ₹${oldPrice}`
      );

      console.log(
        `New price: ₹${newPrice}`
      );

      console.log(
        "Checking price alerts..."
      );


      // ======================================
      // SAVE PRICE HISTORY
      // ======================================

      await PriceHistory.create({

        product:
          listing.product,

        listing:
          listing._id,

        price:
          newPrice,
      });


      // ======================================
      // CHECK PRICE ALERTS IMMEDIATELY
      // ======================================

      await checkPriceAlerts();


      console.log(
        "Price alerts checked after seller price update"
      );

      console.log(
        "================================="
      );
    }


    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json(
      updatedListing
    );
  });


// ==========================================
// DELETE LISTING
// ==========================================

const deleteListing =
  asyncHandler(async (req, res) => {

    const listing =
      await Listing.findById(
        req.params.id
      );


    // ========================================
    // CHECK LISTING
    // ========================================

    if (!listing) {

      res.status(404);

      throw new Error(
        "Listing not found"
      );
    }


    // ========================================
    // CHECK AUTHORIZATION
    // ========================================

    const isOwner =
      listing.seller.toString() ===
      req.user._id.toString();


    const isAdmin =
      req.user.role ===
      "admin";


    if (
      !isOwner &&
      !isAdmin
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }


    // ========================================
    // DELETE PRICE HISTORY
    // ========================================

    await PriceHistory.deleteMany({
      listing:
        listing._id,
    });


    // ========================================
    // DELETE LISTING
    // ========================================

    await listing.deleteOne();


    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({

      message:
        "Listing deleted successfully",
    });
  });


module.exports = {

  createListing,

  getProductListings,

  getSellerListings,

  getSellerStats,

  getAllListings,

  updateListing,

  deleteListing,
};