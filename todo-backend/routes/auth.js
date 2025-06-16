const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );

    res.json(result.rows[0]); // Returns { id, username }
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login existing user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
