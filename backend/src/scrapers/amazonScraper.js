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
        await browser.newPage({
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        });

      await page.goto(url, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

console.log("Amazon current URL:", page.url());
console.log("Amazon page title:", await page.title());

await page.screenshot({
  path: "/tmp/amazon-debug.png",
  fullPage: true,
});

const productTitleCount =
  await page.locator("#productTitle").count();

console.log(
  "Amazon #productTitle count:",
  productTitleCount
);

if (productTitleCount === 0) {
  const bodyText = await page.locator("body").innerText();

  console.log(
    "Amazon page text preview:",
    bodyText.slice(0, 2000)
  );

  throw new Error(
    "Amazon product page did not contain #productTitle. Amazon may have returned a challenge, redirect, or different page."
  );
}

await page.locator("#productTitle").waitFor({
  state: "visible",
  timeout: 15000,
});

      const productData =
        await page.evaluate(() => {
          const title =
            document.querySelector(
              "#productTitle"
            )?.innerText?.trim() ||
            "";

          /* Images */

          const images = [
            ...document.querySelectorAll(
              "#altImages img"
            ),
          ]
            .map((img) =>
              img.src?.replace(
                /\._[^.]+_\./,
                "."
              )
            )
            .filter(
              (src) =>
                src &&
                !src
                  .toLowerCase()
                  .includes("video") &&
                !src
                  .toLowerCase()
                  .includes("play-icon")
            );

          const mainImage =
            document.querySelector(
              "#landingImage"
            )?.src;

          if (
            mainImage &&
            !images.includes(
              mainImage
            )
          ) {
            images.unshift(
              mainImage
            );
          }

          const uniqueImages =
            [...new Set(images)];

          /* Price */

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

          /* Brand */

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
              .replace(
                "Brand:",
                ""
              )
              .trim();

          /* Rating */

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
            parseInt(
              reviewsText.replace(
                /[^0-9]/g,
                ""
              )
            ) || 0;

          /* Description */

          const description =
            document.querySelector(
              "#productDescription"
            )?.innerText?.trim() ||

            document.querySelector(
              "#feature-bullets"
            )?.innerText?.trim() ||

            "";

          /* Specifications */

          const specifications =
            {};

          const extractTable =
            (selector) => {
              document
                .querySelectorAll(
                  selector
                )
                .forEach(
                  (row) => {
                    const key =
                      row.querySelector(
                        "th"
                      )
                        ?.innerText?.trim();

                    const value =
                      row.querySelector(
                        "td"
                      )
                        ?.innerText?.trim();

                    if (
                      key &&
                      value &&
                      !specifications[
                        key
                      ]
                    ) {
                      specifications[
                        key
                      ] = value;
                    }
                  }
                );
            };

          extractTable(
            "#productDetails_techSpec_section_1 tr"
          );

          extractTable(
            "#productDetails_detailBullets_sections1 tr"
          );

          extractTable(
            ".a-keyvalue tr"
          );

          /* Features */

          const features = [
            ...new Set(
              [
                ...document.querySelectorAll(
                  "#feature-bullets li span"
                ),
              ]
                .map((item) =>
                  item.innerText
                    .replace(
                      /\s+/g,
                      " "
                    )
                    .trim()
                )
                .filter(
                  (item) =>
                    item &&
                    item.length >
                      10 &&
                    !item.includes(
                      "Make sure this fits"
                    )
                )
            ),
          ];

          Object.entries(
            specifications
          )
            .slice(0, 8)
            .forEach(
              ([
                key,
                value,
              ]) => {
                features.push(
                  `${key}: ${value}`
                );
              }
            );

          const uniqueFeatures =
            [
              ...new Set(
                features
              ),
            ].slice(0, 15);

          return {
            title,
            brand,
            category:
              "General",
            description,
            features:
              uniqueFeatures,
            specifications,
            images:
              uniqueImages.slice(
                0,
                10
              ),
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