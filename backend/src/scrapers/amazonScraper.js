const { chromium } = require("playwright");

const scrapeAmazonProduct = async (url) => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1366,
        height: 768,
      },

      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",

      locale: "en-IN",
      timezoneId: "Asia/Kolkata",
    });

    // Extra headers
    await page.setExtraHTTPHeaders({
      "Accept-Language":
        "en-IN,en;q=0.9,en-US;q=0.8",
      "Upgrade-Insecure-Requests": "1",
    });

    console.log("========================================");
    console.log("Starting Amazon scraper");
    console.log("URL:", url);
    console.log("========================================");

    // --------------------------------------------------
    // 1. OPEN AMAZON
    // --------------------------------------------------

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log(
      "Amazon HTTP status:",
      response ? response.status() : "No response"
    );

    console.log(
      "Amazon current URL:",
      page.url()
    );

    console.log(
      "Amazon page title:",
      await page.title()
    );

    // Give Amazon a little time to finish rendering
await page.waitForTimeout(3000);

// --------------------------------------------------
// 2. HANDLE AMAZON "CONTINUE SHOPPING" PAGE
// --------------------------------------------------

let bodyText = await page
  .locator("body")
  .innerText()
  .catch(() => "");

console.log(
  "Initial Amazon body:",
  bodyText.slice(0, 1000)
);

if (
  bodyText
    .toLowerCase()
    .includes("click the button below to continue shopping")
) {
  console.log(
    "Amazon Continue Shopping page detected."
  );

  const continueButton = page
    .getByRole("button", {
      name: /continue shopping/i,
    })
    .first();

  if (await continueButton.count()) {
    console.log(
      "Clicking Continue Shopping..."
    );

    await continueButton.click();

    await page.waitForTimeout(5000);

    console.log(
      "URL after Continue Shopping:",
      page.url()
    );

    console.log(
      "Title after Continue Shopping:",
      await page.title()
    );
  } else {
    const continueLink = page
      .getByText("Continue shopping", {
        exact: true,
      })
      .first();

    if (await continueLink.count()) {
      console.log(
        "Clicking Continue Shopping link..."
      );

      await continueLink.click();

      await page.waitForTimeout(5000);

      console.log(
        "URL after Continue Shopping:",
        page.url()
      );

      console.log(
        "Title after Continue Shopping:",
        await page.title()
      );
    } else {
      throw new Error(
        "Amazon returned a Continue Shopping page, but the Continue Shopping control could not be found."
      );
    }
  }
}

// --------------------------------------------------
// 3. DEBUG INFORMATION
// --------------------------------------------------

const currentUrl = page.url();
const pageTitle = await page.title();

console.log(
  "Amazon final URL:",
  currentUrl
);

console.log(
  "Amazon final title:",
  pageTitle
);

bodyText = await page
  .locator("body")
  .innerText()
  .catch(() => "");

console.log(
  "Amazon final body preview:",
  bodyText.slice(0, 2000)
);

    // --------------------------------------------------
    // 3. DETECT AMAZON CHALLENGE / CAPTCHA
    // --------------------------------------------------

    const bodyText = await page
      .locator("body")
      .innerText()
      .catch(() => "");

    const lowerBodyText =
      bodyText.toLowerCase();

    const challengeDetected =
      lowerBodyText.includes(
        "enter the characters you see below"
      ) ||
      lowerBodyText.includes(
        "sorry, we just need to make sure you're not a robot"
      ) ||
      lowerBodyText.includes(
        "captcha"
      ) ||
      lowerBodyText.includes(
        "robot check"
      ) ||
      lowerBodyText.includes(
        "automated access"
      ) ||
      lowerBodyText.includes(
        "something went wrong"
      ) ||
      currentUrl.includes(
        "/errors/validateCaptcha"
      ) ||
      currentUrl.includes(
        "captcha"
      );

    if (challengeDetected) {
      console.error(
        "Amazon returned a CAPTCHA / bot challenge."
      );

      console.error(
        "Amazon URL:",
        currentUrl
      );

      console.error(
        "Amazon title:",
        pageTitle
      );

      console.error(
        "Amazon body preview:",
        bodyText.slice(0, 2000)
      );

      await page
        .screenshot({
          path: "/tmp/amazon-challenge.png",
          fullPage: true,
        })
        .catch(() => {});

      throw new Error(
        "Amazon blocked the automated request with a CAPTCHA or bot challenge."
      );
    }

    // --------------------------------------------------
    // 4. CHECK PRODUCT TITLE
    // --------------------------------------------------

    const titleSelectors = [
      "#productTitle",
      "#title span",
      "h1#title",
      "h1 span#productTitle",
    ];

    let titleSelector = null;

    for (const selector of titleSelectors) {
      const count = await page
        .locator(selector)
        .count()
        .catch(() => 0);

      console.log(
        `Selector ${selector}: ${count}`
      );

      if (count > 0) {
        titleSelector = selector;
        break;
      }
    }

    if (!titleSelector) {
      console.error(
        "Amazon product title was NOT found."
      );

      console.error(
        "Current URL:",
        currentUrl
      );

      console.error(
        "Page title:",
        pageTitle
      );

      console.error(
        "Body preview:",
        bodyText.slice(0, 3000)
      );

      await page
        .screenshot({
          path: "/tmp/amazon-debug.png",
          fullPage: true,
        })
        .catch(() => {});

      throw new Error(
        "Amazon product page did not contain a recognizable product title. Amazon may have returned a challenge, redirect, unavailable product page, or changed HTML."
      );
    }

    await page
      .locator(titleSelector)
      .first()
      .waitFor({
        state: "visible",
        timeout: 15000,
      });

    // --------------------------------------------------
    // 5. EXTRACT PRODUCT DATA
    // --------------------------------------------------

    const productData = await page.evaluate(() => {
      // ----------------------------------------------
      // TITLE
      // ----------------------------------------------

      const title =
        document
          .querySelector("#productTitle")
          ?.innerText
          ?.trim() ||

        document
          .querySelector("#title span")
          ?.innerText
          ?.trim() ||

        document
          .querySelector("h1#title")
          ?.innerText
          ?.trim() ||

        "";

      // ----------------------------------------------
      // IMAGES
      // ----------------------------------------------

      const images = [
        ...document.querySelectorAll(
          "#altImages img"
        ),
      ]
        .map((img) => {
          const src =
            img.src ||
            img.getAttribute("data-src") ||
            img.getAttribute(
              "data-old-hires"
            );

          return src
            ? src.replace(
                /\._[^.]+_\./,
                "."
              )
            : "";
        })
        .filter((src) => {
          if (!src) return false;

          const lower =
            src.toLowerCase();

          return (
            !lower.includes("video") &&
            !lower.includes("play-icon") &&
            !lower.includes("sprite")
          );
        });

      // Main product image

      const mainImage =
        document.querySelector(
          "#landingImage"
        )?.src ||

        document.querySelector(
          "#imgTagWrapperId img"
        )?.src ||

        "";

      if (
        mainImage &&
        !images.includes(mainImage)
      ) {
        images.unshift(mainImage);
      }

      const uniqueImages = [
        ...new Set(images),
      ];

      // ----------------------------------------------
      // PRICE
      // ----------------------------------------------

      const priceSelectors = [
        ".a-price .a-offscreen",
        ".priceToPay .a-offscreen",
        "#corePrice_feature_div .a-offscreen",
        "#apex_desktop .a-offscreen",
        ".a-price-whole",
      ];

      let priceText = "";

      for (
        const selector of priceSelectors
      ) {
        const element =
          document.querySelector(
            selector
          );

        if (
          element?.innerText?.trim()
        ) {
          priceText =
            element.innerText.trim();
          break;
        }
      }

      const price =
        Number(
          priceText.replace(
            /[^0-9.]/g,
            ""
          )
        ) || 0;

      // ----------------------------------------------
      // BRAND
      // ----------------------------------------------

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

      // ----------------------------------------------
      // RATING
      // ----------------------------------------------

      const ratingText =
        document.querySelector(
          "#acrPopover"
        )?.innerText ||

        document.querySelector(
          '[data-hook="rating-out-of-text"]'
        )?.innerText ||

        "";

      const ratingMatch =
        ratingText.match(
          /([0-5](?:\.[0-9])?)/
        );

      const rating =
        ratingMatch
          ? parseFloat(
              ratingMatch[1]
            )
          : 0;

      // ----------------------------------------------
      // REVIEWS
      // ----------------------------------------------

      const reviewsText =
        document.querySelector(
          "#acrCustomerReviewText"
        )?.innerText ||

        document.querySelector(
          '[data-hook="total-review-count"]'
        )?.innerText ||

        "";

      const reviewsCount =
        parseInt(
          reviewsText.replace(
            /[^0-9]/g,
            ""
          )
        ) || 0;

      // ----------------------------------------------
      // DESCRIPTION
      // ----------------------------------------------

      const description =
        document.querySelector(
          "#productDescription"
        )?.innerText
          ?.trim() ||

        document.querySelector(
          "#feature-bullets"
        )?.innerText
          ?.trim() ||

        "";

      // ----------------------------------------------
      // SPECIFICATIONS
      // ----------------------------------------------

      const specifications = {};

      const extractTable = (
        selector
      ) => {
        document
          .querySelectorAll(selector)
          .forEach((row) => {
            const key =
              row
                .querySelector("th")
                ?.innerText
                ?.trim();

            const value =
              row
                .querySelector("td")
                ?.innerText
                ?.trim();

            if (
              key &&
              value &&
              !specifications[key]
            ) {
              specifications[key] =
                value;
            }
          });
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

      // ----------------------------------------------
      // FEATURES
      // ----------------------------------------------

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
                item.length > 10 &&
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
          ([key, value]) => {
            features.push(
              `${key}: ${value}`
            );
          }
        );

      const uniqueFeatures = [
        ...new Set(features),
      ].slice(0, 15);

      // ----------------------------------------------
      // RETURN
      // ----------------------------------------------

      return {
        title,
        brand,

        category: "General",

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

    // --------------------------------------------------
    // 6. VALIDATE RESULT
    // --------------------------------------------------

    if (!productData.title) {
      throw new Error(
        "Amazon scraper extracted an empty product title."
      );
    }

    if (
      !productData.price ||
      productData.price <= 0
    ) {
      console.warn(
        "Warning: Amazon product price could not be detected."
      );
    }

    console.log(
      "Amazon product scraped successfully:"
    );

    console.log({
      title:
        productData.title,
      brand:
        productData.brand,
      price:
        productData.price,
      rating:
        productData.rating,
      reviewsCount:
        productData.reviewsCount,
      images:
        productData.images.length,
    });

    // --------------------------------------------------
    // 7. RETURN
    // --------------------------------------------------

    return {
      ...productData,

      source: "Amazon",

      productUrl: url,
    };
  } catch (error) {
    console.error(
      "Amazon scraper failed:"
    );

    console.error(
      error.message
    );

    throw error;
  } finally {
    await browser.close();
  }
};

module.exports =
  scrapeAmazonProduct;