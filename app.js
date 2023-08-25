require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./config/db");
const PORT = process.env.PORT;
const cors = require("cors");

const allowedOrigins = JSON.parse(process.env.ORIGIN);
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

connectDb();

app.use(express.json());

const authRoutes = require("./routes/auth");
const transactions = require("./routes/transaction");
const request = require("./routes/request");
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactions);
app.use("/api/request", request);
app.use("/api/otp", require("./routes/otp"));

app.all("*", (req, res) => {
  res.send("404 page");
});

app.use(require("./middlewares/errorMiddleware"));

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
