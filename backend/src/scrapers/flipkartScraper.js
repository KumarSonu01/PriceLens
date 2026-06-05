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
            [
              ...document.querySelectorAll(
                'script[type="application/ld+json"]'
              ),
            ].find((s) =>
              s.textContent.includes(
                '"Product"'
              )
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
              ? json.find(
                  (item) =>
                    item["@type"] ===
                    "Product"
                ) || json[0]
              : json;

          const pageText =
            document.body.innerText;

          const specifications =
            {};

          const memoryMatch =
            pageText.match(
              /(\d+\s*GB\s*RAM)\s*\|\s*(\d+\s*GB\s*ROM)/i
            );

          if (memoryMatch) {
            specifications.RAM =
              memoryMatch[1];

            specifications.Storage =
              memoryMatch[2];
          }

          const processorMatch =
            pageText.match(
              /([A-Za-z0-9\s]+Processor\s*\|\s*.*?Clock Speed)/i
            );

          if (processorMatch) {
            specifications.Processor =
              processorMatch[1].trim();
          }

          const rearCameraMatch =
            pageText.match(
              /\d+\s*MP.*?Rear Camera/i
            );

          if (rearCameraMatch) {
            specifications.RearCamera =
              rearCameraMatch[0];
          }

          const frontCameraMatch =
            pageText.match(
              /\d+\s*MP.*?Front Camera/i
            );

          if (frontCameraMatch) {
            specifications.FrontCamera =
              frontCameraMatch[0];
          }

          const displayMatch =
            pageText.match(
              /\d+(\.\d+)?\s*inch.*?Display/i
            );

          if (displayMatch) {
            specifications.Display =
              displayMatch[0];
          }

          const batteryMatch =
            pageText.match(
              /\d+\s*mAh\s*Battery/i
            );

          if (batteryMatch) {
            specifications.Battery =
              batteryMatch[0];
          }

          const features = [
            specifications.RAM,
            specifications.Storage,
            specifications.Processor,
            specifications.Display,
            specifications.Battery,
            specifications.RearCamera,
            specifications.FrontCamera,
          ].filter(Boolean);

          const images =
            Array.isArray(
              product.image
            )
              ? product.image
              : product.image
              ? [
                  product.image,
                ]
              : [];

          return {
            title:
              product.name ||
              "",

            brand:
              product.brand
                ?.name || "",

            category:
              product.category ||
              "General",

            description:
              product.description ||
              "",

            images,

            price:
              Number(
                product.offers
                  ?.price
              ) || 0,

            rating:
              Number(
                product
                  ?.aggregateRating
                  ?.ratingValue
              ) || 0,

            reviewsCount:
              Number(
                product
                  ?.aggregateRating
                  ?.reviewCount
              ) || 0,

            specifications,

            features,
          };
        });

      return {
        ...productData,
        source: "Flipkart",
        productUrl: url,
      };
    } finally {
      await browser.close();
    }
  };

module.exports =
  scrapeFlipkartProduct;