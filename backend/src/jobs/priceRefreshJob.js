const cron =
  require("node-cron");

const checkPriceAlerts =
  require("./checkPriceAlerts");

const Listing =
  require("../models/Listing");

const PriceHistory =
  require("../models/PriceHistory");

const scrapeFlipkartProduct =
  require("../scrapers/flipkartScraper");

const scrapeAmazonProduct =
  require("../scrapers/amazonScraper");

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
              isScraped: true,
            });

          console.log(
            `Found ${listings.length} imported products`
          );

          for (const listing of listings) {
            try {
              let scrapedData;

              if (
                listing.source ===
                "Flipkart"
              ) {
                scrapedData =
                  await scrapeFlipkartProduct(
                    listing.productUrl
                  );
              } else if (
                listing.source ===
                "Amazon"
              ) {
                scrapedData =
                  await scrapeAmazonProduct(
                    listing.productUrl
                  );
              } else {
                continue;
              }

              if ( !scrapedData.price ||  scrapedData.price <= 0) {
                throw new Error(
                  `Invalid scraped price: ${scrapedData.price}`
                );
            }

              const oldPrice =
                listing.price;
                        
              listing.price =
                scrapedData.price;

              listing.rating =
                scrapedData.rating || 0;

              listing.reviewsCount =
                scrapedData.reviewsCount || 0;

              listing.images =
                scrapedData.images ||
                listing.images;

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
                  `${listing.source}: ₹${oldPrice} → ₹${scrapedData.price}`
                );
              }
            } catch (error) {
              console.log(
                `Failed ${listing.source}: ${listing._id}`
              );

              console.log(
                error.message
              );
            }
          }

          await checkPriceAlerts();

          console.log(
            "Price alerts checked"
          );
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