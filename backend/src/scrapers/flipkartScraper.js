const { chromium } = require("playwright");

const scrapeFlipkartProduct = async (url) => {
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

    await page.setExtraHTTPHeaders({
      "Accept-Language":
        "en-IN,en;q=0.9,en-US;q=0.8",
      "Upgrade-Insecure-Requests": "1",
    });

    console.log(
      "========================================"
    );

    console.log(
      "Starting Flipkart scraper"
    );

    console.log(
      "URL:",
      url
    );

    console.log(
      "========================================"
    );

    // --------------------------------------------------
    // 1. OPEN FLIPKART
    // --------------------------------------------------

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log(
      "Flipkart HTTP status:",
      response
        ? response.status()
        : "No response"
    );

    console.log(
      "Flipkart current URL:",
      page.url()
    );

    console.log(
      "Flipkart page title:",
      await page.title()
    );

    // Allow dynamic content to render
    await page.waitForTimeout(4000);

    // --------------------------------------------------
    // 2. GET PAGE TEXT
    // --------------------------------------------------

    let bodyText = await page
      .locator("body")
      .innerText()
      .catch(() => "");

    console.log(
      "Flipkart body preview:",
      bodyText.slice(0, 1500)
    );

    // --------------------------------------------------
    // 3. BASIC BLOCK / ERROR DETECTION
    // --------------------------------------------------

    const lowerBodyText =
      bodyText.toLowerCase();

    const blocked =
      lowerBodyText.includes(
        "access denied"
      ) ||
      lowerBodyText.includes(
        "too many requests"
      ) ||
      lowerBodyText.includes(
        "something went wrong"
      ) ||
      lowerBodyText.includes(
        "captcha"
      ) ||
      lowerBodyText.includes(
        "robot"
      );

    if (blocked) {
      await page
        .screenshot({
          path: "/tmp/flipkart-blocked.png",
          fullPage: true,
        })
        .catch(() => {});

      throw new Error(
        "Flipkart returned a blocked/challenge page instead of the product page."
      );
    }

    // --------------------------------------------------
    // 4. EXTRACT PRODUCT DATA
    // --------------------------------------------------

    const productData =
      await page.evaluate(() => {
        // =================================================
        // HELPER FUNCTIONS
        // =================================================

        const cleanText = (value) =>
          value
            ?.replace(/\s+/g, " ")
            ?.trim() || "";

        const firstText = (
          selectors
        ) => {
          for (
            const selector of selectors
          ) {
            const element =
              document.querySelector(
                selector
              );

            if (element) {
              const text =
                cleanText(
                  element.innerText ||
                    element.textContent
                );

              if (text) {
                return text;
              }
            }
          }

          return "";
        };

        // =================================================
        // JSON-LD
        // =================================================

        let structuredProduct =
          null;

        const scripts = [
          ...document.querySelectorAll(
            'script[type="application/ld+json"]'
          ),
        ];

        for (
          const script of scripts
        ) {
          try {
            const parsed =
              JSON.parse(
                script.textContent
              );

            const candidates =
              Array.isArray(parsed)
                ? parsed
                : parsed["@graph"]
                ? parsed["@graph"]
                : [parsed];

            const product =
              candidates.find(
                (item) => {
                  const type =
                    item?.["@type"];

                  return (
                    type === "Product" ||
                    (
                      Array.isArray(
                        type
                      ) &&
                      type.includes(
                        "Product"
                      )
                    )
                  );
                }
              );

            if (product) {
              structuredProduct =
                product;

              break;
            }
          } catch {
            // Ignore invalid JSON-LD
          }
        }

        // =================================================
        // TITLE
        // =================================================

        const title =
          structuredProduct?.name ||
          firstText([
            "h1",
            "h1._6EBuvT",
            "span.B_NuCI",
            "span.VU-ZEz",
          ]);

        // =================================================
        // BRAND
        // =================================================

        let brand =
          structuredProduct?.brand
            ?.name || "";

        if (!brand) {
          brand =
            firstText([
              "a._2whKao",
              "span.G6XhRU",
            ]);
        }

        // =================================================
        // DESCRIPTION
        // =================================================

        const description =
          structuredProduct?.description ||
          firstText([
            "div._1mXcCf",
            "div._2418kt",
            "div._3WHvuP",
          ]);

        // =================================================
        // PRICE
        // =================================================

        let price =
          Number(
            structuredProduct
              ?.offers?.price
          ) || 0;

        if (!price) {
          const priceText =
            firstText([
              "div.Nx9bqj",
              "div._30jeq3",
              "div._25b18c",
              "div._1_WHN1",
            ]);

          price =
            Number(
              priceText.replace(
                /[^0-9.]/g,
                ""
              )
            ) || 0;
        }

        // =================================================
        // RATING
        // =================================================

        let rating =
          Number(
            structuredProduct
              ?.aggregateRating
              ?.ratingValue
          ) || 0;

        if (!rating) {
          const ratingText =
            firstText([
              "div.XQDdHH",
              "div._3LWZlK",
            ]);

          rating =
            parseFloat(
              ratingText
            ) || 0;
        }

        // =================================================
        // REVIEWS
        // =================================================

        let reviewsCount =
          Number(
            structuredProduct
              ?.aggregateRating
              ?.reviewCount
          ) || 0;

        if (!reviewsCount) {
          const reviewText =
            firstText([
              "span.Wphh3N",
              "span._2_R_DZ",
            ]);

          const match =
            reviewText.match(
              /[\d,]+/
            );

          reviewsCount =
            match
              ? Number(
                  match[0].replace(
                    /,/g,
                    ""
                  )
                )
              : 0;
        }

        // =================================================
        // IMAGES
        // =================================================

        let images = [];

        if (
          structuredProduct?.image
        ) {
          images =
            Array.isArray(
              structuredProduct.image
            )
              ? structuredProduct.image
              : [
                  structuredProduct.image,
                ];
        }

        if (
          images.length === 0
        ) {
          images = [
            ...document.querySelectorAll(
              "img"
            ),
          ]
            .map(
              (img) =>
                img.src ||
                img.getAttribute(
                  "data-src"
                ) ||
                ""
            )
            .filter(
              (src) => {
                const lower =
                  src.toLowerCase();

                return (
                  src &&
                  (
                    lower.includes(
                      "rukminim"
                    ) ||
                    lower.includes(
                      "flipkart"
                    )
                  )
                );
              }
            );
        }

        images = [
          ...new Set(
            images.filter(Boolean)
          ),
        ].slice(0, 10);

        // =================================================
        // PAGE TEXT
        // =================================================

        const pageText =
          document.body.innerText;

        // =================================================
        // SPECIFICATIONS
        // =================================================

        const specifications =
          {};

        // Try Flipkart specification tables
        document
          .querySelectorAll(
            "table tr"
          )
          .forEach((row) => {
            const cells = [
              ...row.querySelectorAll(
                "td, th"
              ),
            ]
              .map((cell) =>
                cleanText(
                  cell.innerText
                )
              )
              .filter(Boolean);

            if (
              cells.length >= 2
            ) {
              const key =
                cells[0];

              const value =
                cells
                  .slice(1)
                  .join(" | ");

              if (
                key &&
                value &&
                !specifications[key]
              ) {
                specifications[
                  key
                ] = value;
              }
            }
          });

        // =================================================
        // COMMON MOBILE SPECIFICATIONS
        // =================================================

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
            /([A-Za-z0-9\s\-]+Processor\s*\|\s*.*?Clock Speed)/i
          );

        if (processorMatch) {
          specifications.Processor =
            processorMatch[1]
              .trim();
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

        // =================================================
        // FEATURES
        // =================================================

        const features = [];

        const featureSelectors = [
          "ul._2418kt li",
          "div._2418kt li",
          "div._1AN87F li",
          "li",
        ];

        for (
          const selector of
            featureSelectors
        ) {
          document
            .querySelectorAll(
              selector
            )
            .forEach((item) => {
              const text =
                cleanText(
                  item.innerText
                );

              if (
                text &&
                text.length > 10 &&
                !features.includes(
                  text
                )
              ) {
                features.push(
                  text
                );
              }
            });

          if (
            features.length >= 10
          ) {
            break;
          }
        }

        // Add specifications
        Object.entries(
          specifications
        )
          .slice(0, 8)
          .forEach(
            ([key, value]) => {
              const feature =
                `${key}: ${value}`;

              if (
                !features.includes(
                  feature
                )
              ) {
                features.push(
                  feature
                );
              }
            }
          );

        const uniqueFeatures = [
          ...new Set(features),
        ].slice(0, 15);

        // =================================================
        // RETURN
        // =================================================

        return {
          title:
            cleanText(title),

          brand:
            cleanText(brand),

          category:
            structuredProduct?.category ||
            "General",

          description:
            cleanText(
              description
            ),

          images,

          price,

          rating,

          reviewsCount,

          specifications,

          features:
            uniqueFeatures,
        };
      });

    // --------------------------------------------------
    // 5. VALIDATE
    // --------------------------------------------------

    if (!productData.title) {
      await page
        .screenshot({
          path: "/tmp/flipkart-debug.png",
          fullPage: true,
        })
        .catch(() => {});

      throw new Error(
        "Flipkart product title could not be detected. Flipkart may have returned a different page or changed its HTML."
      );
    }

    console.log(
      "Flipkart product scraped successfully:"
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
    // 6. RETURN
    // --------------------------------------------------

    return {
      ...productData,

      source: "Flipkart",

      productUrl: url,
    };
  } catch (error) {
    console.error(
      "Flipkart scraper failed:"
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
  scrapeFlipkartProduct;