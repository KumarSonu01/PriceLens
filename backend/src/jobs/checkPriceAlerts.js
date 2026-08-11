const PriceAlert =
  require("../models/PriceAlert");

const Listing =
  require("../models/Listing");

const resend =
  require("../config/mailer");

const checkPriceAlerts =
  async () => {
    try {
      const alerts =
        await PriceAlert.find({
          isTriggered: false,
        })
          .populate("user")
          .populate("product");

      for (const alert of alerts) {
        if (
          !alert.user ||
          !alert.product
        ) {
          continue;
        }

        const cheapestListing =
          await Listing.findOne({
            product:
              alert.product._id,

            price: {
              $gt: 0,
            },
          }).sort({
            price: 1,
          });

        if (!cheapestListing) {
          continue;
        }

        if (
          cheapestListing.price <=
          alert.targetPrice
        ) {
          try {
            const { data, error } =
              await resend.emails.send({
                from:
                  "PriceLens <onboarding@resend.dev>",

                to:
                  [alert.user.email],

                subject:
                  "Price Drop Alert 🔥",

                html: `
                  <h2>
                    Price Drop Detected
                  </h2>

                  <p>
                    <strong>
                      ${alert.product.title}
                    </strong>
                  </p>

                  <p>
                    Your target price:
                    ₹${alert.targetPrice.toLocaleString()}
                  </p>

                  <p>
                    Current lowest price:
                    ₹${cheapestListing.price.toLocaleString()}
                  </p>

                  <p>
                    Open PriceLens
                    to view the deal.
                  </p>
                `,
              });

            if (error) {
              throw new Error(
                error.message ||
                  "Resend email failed"
              );
            }

            alert.isTriggered =
              true;

            await alert.save();

            console.log(
              `Alert sent to ${alert.user.email}`
            );

            console.log(
              "Resend email ID:",
              data?.id
            );
          } catch (error) {
            console.error(
              `Failed sending alert to ${alert.user.email}`
            );

            console.error(
              error.message
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Price alert job failed:"
      );

      console.error(
        error.message
      );
    }
  };

module.exports =
  checkPriceAlerts;