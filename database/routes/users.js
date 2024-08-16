const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const db = require("../conn"); // Assuming you have the connection pool setup in conn.js

router.use(express.json()); // Middleware to parse JSON bodies

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
  const result1 = await db.query("SELECT count(id) AS user_count FROM user");
  let userID = result1[0].user_count;
  const user_id = userID++;
  const { email, password, role } = req.body;
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

  try {
    const result = await db.query(
      "INSERT INTO user (email, password, country, invite_code, role) VALUES(?, ?, ?, ?, ?)",
      [email, password, country, invite_code, role]
    );

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
    console.log(walletInsertResult);
    res.json({ message: `User : ${walletInsertResult}  ,added successfully` });
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
