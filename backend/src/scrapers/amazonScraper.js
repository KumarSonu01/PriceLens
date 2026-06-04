const {
  chromium,
} = require("playwright");

const scrapeAmazonProduct =
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
          const title =
            document.querySelector(
              "#productTitle"
            )?.innerText?.trim() ||
            "";

          const image =
            document.querySelector(
              "#landingImage"
            )?.src || "";

          const priceText =
            document.querySelector(
              ".a-price .a-offscreen"
            )?.innerText ||
            document.querySelector(
              ".priceToPay .a-offscreen"
            )?.innerText ||
            "";

          const price =
            Number(
              priceText.replace(
                /[₹,]/g,
                ""
              )
            ) || 0;

          const brandText =
            document.querySelector(
              "#bylineInfo"
            )?.innerText || "";

          const brand =
            brandText
              .replace(
                "Visit the ",
                ""
              )
              .replace(
                "Store",
                ""
              )
              .trim();

          const ratingText =
            document.querySelector(
              "#acrPopover"
            )?.innerText || "";

          const rating =
            parseFloat(
              ratingText
            ) || 0;

          const reviewsText =
            document.querySelector(
              "#acrCustomerReviewText"
            )?.innerText || "";

          const reviewsCount =
            Number(
              reviewsText.replace(
                /[(),]/g,
                ""
              )
            ) || 0;

          const description =
            document.querySelector(
              "#productDescription"
            )?.innerText?.trim() ||
            "";

          const features =
            [
              ...document.querySelectorAll(
                "#feature-bullets li span"
              ),
            ]
              .map((item) =>
                item.innerText.trim()
              )
              .filter(
                (item) =>
                  item &&
                  item.length > 5
              )
              .slice(0, 20);

          const specifications =
            {};

          document
            .querySelectorAll(
              "#productDetails_techSpec_section_1 tr"
            )
            .forEach((row) => {
              const key =
                row.querySelector(
                  "th"
                )?.innerText?.trim();

              const value =
                row.querySelector(
                  "td"
                )?.innerText?.trim();

              if (
                key &&
                value
              ) {
                specifications[
                  key
                ] = value;
              }
            });

          if (
            Object.keys(
              specifications
            ).length === 0
          ) {
            document
              .querySelectorAll(
                ".a-keyvalue tr"
              )
              .forEach(
                (row) => {
                  const key =
                    row.querySelector(
                      "th"
                    )?.innerText?.trim();

                  const value =
                    row.querySelector(
                      "td"
                    )?.innerText?.trim();

                  if (
                    key &&
                    value
                  ) {
                    specifications[
                      key
                    ] = value;
                  }
                }
              );
          }

          return {
            title,

            brand,

            category:
              "General",

            description,

            features,

            specifications,

            images:
              image
                ? [image]
                : [],

            price,

            rating,

            reviewsCount,
          };
        });

      return {
        ...productData,

        source:
          "Amazon",

        productUrl:
          url,
      };
    } finally {
      await browser.close();
    }
  };

module.exports =
  scrapeAmazonProduct;