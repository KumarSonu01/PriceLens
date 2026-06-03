const {
  chromium,
} = require("playwright");

const scrapeAmazonProduct =
  async (url) => {
    const browser =
      await chromium.launch({
        headless: true,
      });

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
          )?.innerText?.trim() || "";

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
              " Store",
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

        return {
          title,
          brand,
          category:
            "General",

          description:
            "",

          images: [image],

          price,

          rating,

          reviewsCount,
        };
      });

    await browser.close();

    return {
      ...productData,

      source:
        "Amazon",

      productUrl:
        url,
    };
  };

module.exports =
  scrapeAmazonProduct;