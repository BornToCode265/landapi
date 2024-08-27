const express = require("express");
require("dotenv").config();
const stripeSecretKey = process.env.stripeSecretKey;
const router = express.Router();
router.use(express.json());

const str =
  "sk_test_51MkDqgErj3NXX7Re2nctuj5B8uuNOuXN8lAPQlQ5Z07bfJQzEKGmXdwZ24rJn9uYBPxHJC5r4OHjxvj8AwoMubI000ejhFb42u";
const stripe = require("stripe")(str);

const baseUrl = "http://localhost:3000";

router.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "land",
          },
          unit_amount: 70 * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/success_page?session_id=${CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel_page`,
  });

  res.redirect(session.url);
});

router.get("/success_page", async (req, res) => {
  // const session = await stripe.checkout.session.retrieve(req.query.session_id, {
  //   expand: ["payment_intent.payment_method"],
  // });

  res.send(`Your payment was successful with ref : ${req.query.session_id}`);
});

router.get("/cancel_page", (req, res) => {
  res.redirect("./");
});
module.exports = router;
