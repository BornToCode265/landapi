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

//authentication
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log("prince an here lets debug");
  console.log(password);

  try {
    const user = await db.query("SELECT * FROM user WHERE email = ?", [email]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Store the token in the session
    req.session.token = token;

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

router.get("/protected", authenticate, async (req, res) => {
  res.json({ message: "This route is protected" });
});

// PUT user details
router.put("/:id", authenticate, async (req, res) => {
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
