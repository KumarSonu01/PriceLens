const PriceAlert =
  require("../models/PriceAlert");

const Listing =
  require("../models/Listing");

const checkPriceAlerts =
  async () => {
    const alerts =
      await PriceAlert.find({
        isTriggered: false,
      });

    for (const alert of alerts) {
      const listings =
        await Listing.find({
          product:
            alert.product,
        });

      if (
        listings.length === 0
      )
        continue;

      const lowestPrice =
        Math.min(
          ...listings.map(
            (listing) =>
              listing.price
          )
        );

      if (
        lowestPrice <=
        alert.targetPrice
      ) {
        alert.isTriggered =
          true;

        await alert.save();

        console.log(
          `Alert triggered for product ${alert.product}`
        );
      }
    }
  };

module.exports =
  checkPriceAlerts;