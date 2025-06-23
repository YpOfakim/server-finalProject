const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const db = require("../DB/db"); // קובץ התחברות ל־MySQL
const SECRET_KEY = process.env.JWT_SECRET || "SecretKey";

// הרשמה
router.post("/register", async (req, res) => {
  const { name, userName, email, password, phone } = req.body;

  db.query("SELECT * FROM users WHERE userName = ?", [userName], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length > 0) return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (name, userName, email, passwordHash, phone) VALUES (?, ?, ?, ?, ?)",
      [name, userName, email, passwordHash, phone],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Registration failed" });

        const userId = result.insertId;
        const token = jwt.sign({ userId, userName }, SECRET_KEY, { expiresIn: "2h" });

        res.json({
          token,
          user: { id: userId, name, userName, email }
        });
      }
    );
  });
});

// התחברות
router.post("/login", (req, res) => {
  const { userName, password } = req.body;

  db.query("SELECT * FROM users WHERE userName = ?", [userName], async (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, userName: user.userName }, SECRET_KEY, { expiresIn: "2h" });

    res.json({
      token,
      user: { id: user.id, name: user.name, userName: user.userName, email: user.email }
    });
  });
});

module.exports = router;
