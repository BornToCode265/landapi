const stripe = require("stripe")(
  "sk_test_51MkDqgErj3NXX7Re2nctuj5B8uuNOuXN8lAPQlQ5Z07bfJQzEKGmXdwZ24rJn9uYBPxHJC5r4OHjxvj8AwoMubI000ejhFb42u"
);

stripe.products
  .create({
    name: "Starter Subscription",
    description: "$12/Month subscription",
  })
  .then((product) => {
    stripe.prices
      .create({
        unit_amount: 1200,
        currency: "usd",
        recurring: {
          interval: "month",
        },
        product: product.id,
      })
      .then((price) => {
        console.log(
          "Success! Here is your starter subscription product id: " + product.id
        );
        console.log(
          "Success! Here is your starter subscription price id: " + price.id
        );
      });
  });
