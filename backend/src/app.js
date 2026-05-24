const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");

const {
  notFound,
  errorHandler,
} = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("PriceLens API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/sellers", sellerRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;