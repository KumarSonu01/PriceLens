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


// ==========================================
// START PRICE REFRESH JOB
// ==========================================

const startPriceRefreshJob =
  () => {

    cron.schedule(
      "0 2 * * *",

      async () => {

        try {

          console.log(
            "================================="
          );

          console.log(
            "Running daily price refresh..."
          );

          console.log(
            "================================="
          );


          // ========================================
          // GET SCRAPED LISTINGS
          // ========================================

          const listings =
            await Listing.find({
              isScraped: true,
            });


          console.log(
            `Found ${listings.length} imported products`
          );


          // ========================================
          // PROCESS LISTINGS
          // ========================================

          for (
            const listing of listings
          ) {

            try {

              let scrapedData;


              // ======================================
              // FLIPKART
              // ======================================

              if (
                listing.source ===
                "Flipkart"
              ) {

                scrapedData =
                  await scrapeFlipkartProduct(
                    listing.productUrl
                  );

              }


              // ======================================
              // AMAZON
              // ======================================

              else if (
                listing.source ===
                "Amazon"
              ) {

                scrapedData =
                  await scrapeAmazonProduct(
                    listing.productUrl
                  );

              }


              // ======================================
              // UNSUPPORTED SOURCE
              // ======================================

              else {

                console.log(
                  `Skipping unsupported source: ${listing.source}`
                );

                continue;
              }


              // ======================================
              // VALIDATE SCRAPED PRICE
              // ======================================

              if (
                !scrapedData ||
                !scrapedData.price ||
                scrapedData.price <= 0
              ) {

                throw new Error(
                  `Invalid scraped price: ${
                    scrapedData?.price
                  }`
                );
              }


              // ======================================
              // OLD PRICE
              // ======================================

              const oldPrice =
                listing.price;


              // ======================================
              // UPDATE LISTING
              // ======================================

              listing.price =
                scrapedData.price;

              listing.rating =
                scrapedData.rating ||
                0;

              listing.reviewsCount =
                scrapedData.reviewsCount ||
                0;

              listing.images =
                scrapedData.images ||
                listing.images;

              listing.scrapedAt =
                new Date();


              await listing.save();


              // ======================================
              // SAVE PRICE HISTORY
              // ======================================

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

              console.error(
                `Failed ${listing.source}: ${listing._id}`
              );

              console.error(
                error.message
              );
            }
          }


          // ========================================
          // CHECK PRICE ALERTS
          // ========================================

          console.log(
            "Checking price alerts..."
          );


          await checkPriceAlerts();


          console.log(
            "Price alerts checked successfully"
          );


          console.log(
            "================================="
          );

        } catch (error) {

          console.error(
            "Daily price refresh job failed:"
          );

          console.error(
            error.message
          );
        }
      },

      {
        timezone: "Asia/Kolkata",
      }
    );


    console.log(
      "Price refresh cron started"
    );
  };


module.exports =
  startPriceRefreshJob;