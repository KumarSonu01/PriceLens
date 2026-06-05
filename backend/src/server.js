require("dotenv").config();

const app =
  require("./app");

const connectDB =
  require("./config/db");

const startPriceRefreshJob =
  require(
    "./jobs/priceRefreshJob"
  );

const comparisonRoutes =
  require(
    "./routes/comparisonRoutes"
  );

/* Routes */

app.use(
  "/api/comparison",
  comparisonRoutes
);

/* Database */

connectDB();

const PORT =
  process.env.PORT ||
  5000;

/* Server */

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  startPriceRefreshJob();
});