const express = require("express");

const cors = require("cors");

const morgan = require("morgan");

const authRoutes =
  require("./routes/authRoutes");

const sellerRoutes =
  require("./routes/sellerRoutes");

const productRoutes =
  require("./routes/productRoutes");

const listingRoutes =
  require("./routes/listingRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const reviewRoutes =
  require("./routes/reviewRoutes");

const priceAlertRoutes =
  require("./routes/priceAlertRoutes");

const wishlistRoutes =
  require("./routes/wishlistRoutes");

const uploadRoutes =
  require("./routes/uploadRoutes");

const alertRoutes =
  require(
    "./routes/alertRoutes"
  );

const comparisonRoutes =
  require(
    "./routes/comparisonRoutes"
  );

const priceHistoryRoutes =
  require(
    "./routes/priceHistoryRoutes"
  );

const {
  notFound,
  errorHandler,
} = require(
  "./middlewares/errorMiddleware"
);

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(
    "PriceLens API Running"
  );
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/sellers",
  sellerRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/listings",
  listingRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/price-alerts",
  priceAlertRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/alerts",
  alertRoutes
);

app.use(
  "/api/comparison",
  comparisonRoutes
);

app.use(
  "/api/price-history",
  priceHistoryRoutes
);

app.use(notFound);

app.use(errorHandler);

module.exports = app;