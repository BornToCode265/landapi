const express = require("express");
const app = express();
const usersRouter = require("./database/routes/users.js");
const paymentRouter = require("./database/routes/payment.js");
const conn = require("./database/conn.js");

app.use("/api/users", usersRouter);
app.use("/api/payment", paymentRouter);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("views"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
