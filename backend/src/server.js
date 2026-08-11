require("dotenv").config();

const app =
  require("./app");

const connectDB =
  require("./config/db");

const startPriceRefreshJob =
  require(
    "./jobs/priceRefreshJob"
  );

/* Database */

connectDB();

const PORT =
  process.env.PORT ||
  5000;

/* Server */

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );

    startPriceRefreshJob();
  }
);