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
            Array.isArray(json)
              ? json[0]
              : json;

          const pageLines =
            document.body.innerText
              .split("\n")
              .map((line) =>
                line.trim()
              )
              .filter(Boolean);

          const specifications =
            {};

          for (const line of pageLines) {
            if (
              line.includes(
                "RAM"
              ) &&
              line.includes(
                "ROM"
              )
            ) {
              specifications.Memory =
                line;
            }

            if (
              line.includes(
                "Processor"
              )
            ) {
              specifications.Processor =
                line;
            }

            if (
              line.includes(
                "Rear Camera"
              )
            ) {
              specifications.RearCamera =
                line;
            }

            if (
              line.includes(
                "Front Camera"
              )
            ) {
              specifications.FrontCamera =
                line;
            }

            if (
              line.includes(
                "Display"
              ) &&
              !line.includes(
                "Excellent phone"
              )
            ) {
              specifications.Display =
                line;
            }

            if (
              line.includes(
                "Battery"
              ) &&
              line.length < 50
            ) {
              specifications.Battery =
                line;
            }
          }

          const features =
            Object.values(
              specifications
            );

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

            specifications,

            features,
          };
        });

      return {
        ...productData,

        source:
          "Flipkart",

        productUrl:
          url,
      };
    } finally {
      await browser.close();
    }
  };

module.exports =
  scrapeFlipkartProduct;