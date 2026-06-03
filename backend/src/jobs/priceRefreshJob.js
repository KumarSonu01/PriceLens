const cron =
  require("node-cron");

const Product =
  require("../models/Product");

const Listing =
  require("../models/Listing");

const PriceHistory =
  require("../models/PriceHistory");

const scrapeFlipkartProduct =
  require("../scrapers/flipkartScraper");

const startPriceRefreshJob =
  () => {
    cron.schedule(
      "0 2 * * *",
      async () => {
        try {
          console.log(
            "Running daily price refresh..."
          );

          const listings =
            await Listing.find({
              source:
                "Flipkart",

              isScraped:
                true,
            });

          console.log(
            `Found ${listings.length} imported products`
          );

          for (const listing of listings) {
            try {
              const scrapedData =
                await scrapeFlipkartProduct(
                  listing.productUrl
                );

              const oldPrice =
                listing.price;

              listing.price =
                scrapedData.price;

              listing.rating =
                scrapedData.rating;

              listing.reviewsCount =
                scrapedData.reviewsCount;

              listing.scrapedAt =
                new Date();

              await listing.save();

              if (
                oldPrice !==
                scrapedData.price
              ) {
                await PriceHistory.create({
                  product:
                    listing.product,

                  listing:
                    listing._id,

                  price:
                    scrapedData.price,
                });

                console.log(
                  `Price changed: ₹${oldPrice} → ₹${scrapedData.price}`
                );
              }
            } catch (error) {
              console.log(
                `Failed: ${listing._id}`
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    );

    console.log(
      "Price refresh cron started"
    );
  };

module.exports =
  startPriceRefreshJob;