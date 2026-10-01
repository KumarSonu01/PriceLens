const PriceAlert =
  require("../models/PriceAlert");

const Listing =
  require("../models/Listing");

// Register referenced models for populate()
require("../models/User");
require("../models/Product");

const transporter =
  require("../config/mailer");


// ==========================================
// CHECK PRICE ALERTS
// ==========================================

const checkPriceAlerts =
  async () => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "Checking price alerts..."
      );

      console.log(
        "================================="
      );


      // ========================================
      // GET ACTIVE ALERTS
      // ========================================

      const alerts =
        await PriceAlert.find({
          isTriggered: false,
        })
          .populate(
            "user",
            "name email"
          )
          .populate(
            "product",
            "title"
          );


      console.log(
        `Found ${alerts.length} active price alerts`
      );


      // ========================================
      // PROCESS EACH ALERT
      // ========================================

      for (
        const alert of alerts
      ) {

        try {

          console.log(
            "---------------------------------"
          );

          console.log(
            `Processing alert: ${alert._id}`
          );


          // ======================================
          // VALIDATE USER
          // ======================================

          if (
            !alert.user ||
            !alert.user.email
          ) {

            console.log(
              `Skipping alert ${alert._id}: user/email missing`
            );

            continue;
          }


          console.log(
            `Alert belongs to: ${alert.user.email}`
          );


          // ======================================
          // VALIDATE PRODUCT
          // ======================================

          if (
            !alert.product
          ) {

            console.log(
              `Skipping alert ${alert._id}: product missing`
            );

            continue;
          }


          console.log(
            `Product: ${alert.product.title}`
          );


          // ======================================
          // FIND CHEAPEST AVAILABLE LISTING
          // ======================================

          const cheapestListing =
            await Listing.findOne({

              product:
                alert.product._id,

              price: {
                $gt: 0,
              },

              stock: true,

            })
              .sort({
                price: 1,
              });


          // ======================================
          // NO LISTING FOUND
          // ======================================

          if (
            !cheapestListing
          ) {

            console.log(
              `No valid listing found for product ${alert.product._id}`
            );

            continue;
          }


          // ======================================
          // PRICE INFORMATION
          // ======================================

          console.log(
            `Current lowest price: ₹${cheapestListing.price}`
          );

          console.log(
            `Target price: ₹${alert.targetPrice}`
          );

          console.log(
            `Store: ${cheapestListing.source}`
          );

          console.log(
            `Product URL: ${
              cheapestListing.productUrl ||
              "N/A"
            }`
          );


          // ======================================
          // TARGET NOT REACHED
          // ======================================

          if (
            cheapestListing.price >
            alert.targetPrice
          ) {

            console.log(
              `Target not reached for alert ${alert._id}`
            );

            continue;
          }


          // ======================================
          // TARGET REACHED
          // ======================================

          console.log(
            `Target reached for alert ${alert._id}`
          );

          console.log(
            `Sending price alert email to ${alert.user.email}`
          );


          // ======================================
          // EMAIL CONTENT
          // ======================================

          const mailOptions = {

            from:
              `"PriceLens Alerts" <${process.env.EMAIL_USER}>`,

            to:
              alert.user.email,

            subject:
              "Price Drop Alert 🔥",

            html: `

              <!DOCTYPE html>

              <html>

                <head>

                  <meta
                    charset="UTF-8"
                  />

                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />

                  <title>
                    Price Drop Alert
                  </title>

                </head>


                <body
                  style="
                    margin: 0;
                    padding: 30px;
                    background: #f5f5f5;
                    font-family: Arial, sans-serif;
                  "
                >

                  <div
                    style="
                      max-width: 600px;
                      margin: 0 auto;
                      background: #ffffff;
                      padding: 30px;
                      border-radius: 12px;
                      box-shadow:
                        0 4px 20px
                        rgba(0, 0, 0, 0.08);
                    "
                  >

                    <h1
                      style="
                        margin-top: 0;
                        color: #111111;
                      "
                    >
                      Price Drop Alert 🔥
                    </h1>


                    <p
                      style="
                        color: #333333;
                        font-size: 16px;
                      "
                    >
                      Hello
                      ${
                        alert.user.name ||
                        "there"
                      },
                    </p>


                    <p
                      style="
                        color: #333333;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      The price of

                      <strong>
                        ${alert.product.title}
                      </strong>

                      has reached your target price.
                    </p>


                    <hr
                      style="
                        border: none;
                        border-top: 1px solid #eeeeee;
                        margin: 25px 0;
                      "
                    />


                    <p
                      style="
                        color: #333333;
                        font-size: 16px;
                      "
                    >

                      <strong>
                        Your target price:
                      </strong>

                      ₹${Number(
                        alert.targetPrice
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </p>


                    <p
                      style="
                        color: #333333;
                        font-size: 16px;
                      "
                    >

                      <strong>
                        Current lowest price:
                      </strong>

                      ₹${Number(
                        cheapestListing.price
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </p>


                    <p
                      style="
                        color: #333333;
                        font-size: 16px;
                      "
                    >

                      <strong>
                        Store:
                      </strong>

                      ${
                        cheapestListing.source
                      }

                    </p>


                    ${
                      cheapestListing.productUrl
                        ? `

                          <p>

                            <a
                              href="${cheapestListing.productUrl}"
                              target="_blank"
                              rel="noopener noreferrer"
                              style="
                                display: inline-block;
                                background: #111111;
                                color: #ffffff;
                                padding: 12px 20px;
                                border-radius: 8px;
                                text-decoration: none;
                                margin-top: 15px;
                                font-weight: bold;
                              "
                            >
                              View Deal →
                            </a>

                          </p>

                        `
                        : ""
                    }


                    <p
                      style="
                        color: #777777;
                        margin-top: 35px;
                        font-size: 13px;
                      "
                    >
                      This alert was sent by
                      PriceLens.
                    </p>

                  </div>

                </body>

              </html>

            `,
          };


          // ======================================
          // SEND EMAIL
          // ======================================

          const info =
            await transporter.sendMail(
              mailOptions
            );


          // ======================================
          // EMAIL SUCCESS
          // ======================================

          console.log(
            "================================="
          );

          console.log(
            "EMAIL SENT SUCCESSFULLY"
          );

          console.log(
            `Recipient: ${alert.user.email}`
          );

          console.log(
            "Message ID:",
            info.messageId
          );

          console.log(
            "================================="
          );


          // ======================================
          // MARK ALERT AS TRIGGERED
          // ======================================

          alert.isTriggered =
            true;

          await alert.save();


          console.log(
            `Alert ${alert._id} marked as triggered`
          );

        } catch (error) {

          console.error(
            `Failed processing alert ${alert._id}`
          );

          console.error(
            "Email/alert error:",
            error
          );

          // IMPORTANT:
          // Do NOT mark alert as triggered
          // if email sending failed.
        }
      }


      // ========================================
      // COMPLETED
      // ========================================

      console.log(
        "================================="
      );

      console.log(
        "Price alert check completed"
      );

      console.log(
        "================================="
      );

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "Price alert job failed:"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );

      throw error;
    }
  };


module.exports =
  checkPriceAlerts;