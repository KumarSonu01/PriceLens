require("dotenv").config();

const app =
  require("./app");

const connectDB =
  require("./config/db");

const startPriceRefreshJob =
  require("./jobs/priceRefreshJob");

connectDB();

const PORT =
  process.env.PORT ||
  5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  startPriceRefreshJob();
});