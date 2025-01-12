const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const db = require("../conn"); // Assuming you have the connection pool setup in conn.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

//middlewares
router.use(express.urlencoded({ extended: true }));

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

// Middleware to parse JSON bodies
router.use(express.json());
router.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set this to true in production
  })
);

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM user");
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  const role = "admin";
  //exating user checks
  const existingUser = await db.query("SELECT * FROM user WHERE email = ?", [
    email,
  ]);
  if (existingUser.length > 0) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const result1 = await db.query("SELECT count(id) AS user_count FROM user");
  let userID = result1[0].user_count;
  const user_id = userID++;

  const country = "Malawi";
  const invite_code = "Born2Code";

  const wallet = await ethers.Wallet.createRandom();
  const publicKey = wallet.publicKey;
  const privateKey = wallet.privateKey;
  const keyphrase = wallet.mnemonic.phrase;

  const polygon_tokensymbol = "";
  const polygonmain_assets = "";
  const polygontest_assets = "";
  const network = "";
  const bsc_tokensymbol = "";
  const bscmain_assets = "";
  const bsctest_assets = "";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      "INSERT INTO user (username,email, password, country, invite_code, role) VALUES(?, ?, ?, ?, ?,?)",
      [username, email, hashedPassword, country, invite_code, role]
    );

    console.log(`results for insert user ${result}`);

    const walletInsertResult = await db.query(
      "INSERT INTO wallet(user_id, publickey, privatekey, keyphrase, polygon_tokensymbol, polygonmain_assets, polygontest_assets, network, bsc_tokensymbol, bscmain_assets, bsctest_assets) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        publicKey,
        privateKey,
        keyphrase,
        polygon_tokensymbol,
        polygonmain_assets,
        polygontest_assets,
        network,
        bsc_tokensymbol,
        bscmain_assets,
        bsctest_assets,
      ]
    );

    // Handle the result of the wallet insertion as needed
    res.redirect("/login");
    //res.status(201).json({ message: `User added successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// PUT user details
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { land, land_process, private_key, public_key, wallet_address } =
    req.body;
  try {
    const result = await db.query(
      "UPDATE users SET land=?, land_process=?, private_key=?, public_key=?, wallet_address=? WHERE id=?",
      [land, land_process, private_key, public_key, wallet_address, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM users WHERE id=?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = router;
