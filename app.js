const express = require("express");
require("dotenv").config();
const stripeSecretKey = process.env.stripeSecretKey;
const app = express();
const usersRouter = require("./database/routes/users.js");
const paymentRouter = require("./database/routes/payment.js");
const conn = require("./database/conn.js");
const checkoutRouter = require("./database/routes/checkout.js");
const authRouter = require("./database/routes/auth.js");

const baseUrl = "http://localhost:3000";

app.use("/api/users", usersRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/auth", authRouter);



app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static("views"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
