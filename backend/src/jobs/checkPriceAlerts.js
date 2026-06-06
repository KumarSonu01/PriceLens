const PriceAlert =
  require(
    "../models/PriceAlert"
  );

const Listing =
  require(
    "../models/Listing"
  );

const transporter =
  require(
    "../config/mailer"
  );

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
        const cheapestListing =
          await Listing.findOne({
            product:
              alert.product._id,
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
            await transporter.sendMail(
              {
                from:
                  process.env.EMAIL_USER,

                to:
                  alert.user.email,

                subject:
                  "Price Drop Alert 🔥",

                html: `
                  <h2>Price Drop Detected</h2>

                  <p>
                    <strong>
                      ${alert.product.title}
                    </strong>
                  </p>

                  <p>
                    Your target price:
                    ₹${alert.targetPrice}
                  </p>

                  <p>
                    Current lowest price:
                    ₹${cheapestListing.price}
                  </p>

                  <p>
                    Open PriceLens
                    to view the deal.
                  </p>
                `,
              }
            );

            alert.isTriggered =
              true;

            await alert.save();

            console.log(
              `Alert sent to ${alert.user.email}`
            );
          } catch (
            error
          ) {
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