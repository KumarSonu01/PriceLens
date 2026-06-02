const {
  chromium,
} = require("playwright");

const scrapeFlipkartProduct =
  async (url) => {
    const browser =
      await chromium.launch({
        headless: true,
      });

    try {
      const page =
        await browser.newPage();

      await page.goto(url, {
        waitUntil:
          "domcontentloaded",
        timeout: 60000,
      });

      const productData =
        await page.evaluate(() => {
          const script =
            document.querySelector(
              'script[type="application/ld+json"]'
            );

          if (!script) {
            throw new Error(
              "Structured product data not found"
            );
          }

          const json =
            JSON.parse(
              script.textContent
            );

          const product =
            Array.isArray(
              json
            )
              ? json[0]
              : json;

          return {
            title:
              product.name ||
              "",

            brand:
              product.brand
                ?.name || "",

            category:
              product.category ||
              "",

            description:
              product.description ||
              "",

            images:
              product.image ||
              [],

            price:
              Number(
                product.offers
                  ?.price
              ) || 0,

            rating:
              Number(
                product
                  .aggregateRating
                  ?.ratingValue
              ) || 0,

            reviewsCount:
              Number(
                product
                  .aggregateRating
                  ?.reviewCount
              ) || 0,
          };
        });

      return {
        ...productData,

        source:
          "Flipkart",

        productUrl: url,
      };
    } finally {
      await browser.close();
    }
  };

module.exports =
  scrapeFlipkartProduct;