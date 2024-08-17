const fs = require("fs");

const stripe = require("stripe")(stripeSecretKey);
const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const db = require("../conn"); // Assuming you have the connection pool setup in conn.js

router.use(express.json()); // Middleware to parse JSON bodies

router.get("/store", async function (req, res) {
  const result = await db.query("SELECT * FROM land");
  const items = res.json(result);

  fs.readFile(items, function (error, data) {
    if (!result) {
      res.status(500).end();
    } else {
      res.render("store.ejs", {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data),
      });
    }
  });
});

router.post("/purchase", async function (req, res) {
  const result = await db.query("SELECT * FROM land");
  const items = res.json(result);
  fs.readFile(items, function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach(function (item) {
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
      });

      stripe.charges
        .create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: "usd",
        })
        .then(function () {
          console.log("Charge Successful");
          res.json({ message: "Successfully purchased land" });
        })
        .catch(function () {
          console.log("Charge Fail");
          res.status(500).end();
        });
    }
  });
});

module.exports = router;
