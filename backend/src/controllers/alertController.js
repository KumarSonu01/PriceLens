const asyncHandler =
  require(
    "../middlewares/asyncHandler"
  );

const PriceAlert =
  require(
    "../models/PriceAlert"
  );

const createAlert =
  asyncHandler(
    async (req, res) => {
      const {
        productId,
        targetPrice,
      } = req.body;

      const alert =
        await PriceAlert.create({
          user:
            req.user._id,
          product:
            productId,
          targetPrice,
        });

      res.status(201).json(
        alert
      );
    }
  );

const getMyAlerts =
  asyncHandler(
    async (req, res) => {
      const alerts =
        await PriceAlert.find({
          user:
            req.user._id,
        })
          .populate(
            "product",
            "title images slug"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        alerts
      );
    }
  );

const deleteAlert =
  asyncHandler(
    async (req, res) => {
      const alert =
        await PriceAlert.findById(
          req.params.id
        );

      if (!alert) {
        res.status(404);
        throw new Error(
          "Alert not found"
        );
      }

      if (
        alert.user.toString() !==
        req.user._id.toString()
      ) {
        res.status(403);
        throw new Error(
          "Not authorized"
        );
      }

      await alert.deleteOne();

      res.status(200).json({
        success: true,
      });
    }
  );

module.exports = {
  createAlert,
  getMyAlerts,
  deleteAlert,
};