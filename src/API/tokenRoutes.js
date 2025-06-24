const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const genericServices = require("../Services/genericServices");
const SECRET_KEY = process.env.JWT_SECRET || "SecretKey";

// 🔐 רישום משתמש חדש
router.post("/register", async (req, res) => {
  try {
    const { name, userName, email, password, phone } = req.body;
    console.log("user from body:", req.body);
console.log("req.body received:", req.body);
console.log("Password:", password);

    // בדיקה אם המשתמש כבר קיים
    const existingUsers = await genericServices.getRecordsByColumn("users", "user_userName", userName);
    if (existingUsers.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // יצירת משתמש בטבלת users
    const newUser = await genericServices.createRecord("users", {
      user_name: name,
      user_userName: userName,
      email,
      phone,
    });
    console.log("newUser from DB:", newUser);

    // הצפנת סיסמה ושמירתה בטבלת passwords
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hash created:", passwordHash);

    const savedPassword = await genericServices.createRecord("passwords", {
      user_id: newUser.user_id,
      password: passwordHash,
    });
    console.log("Saved password record:", savedPassword);


    // יצירת טוקן JWT
    const token = jwt.sign(
      { userId: newUser.id, userName: userName },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // אחרי יצירת הטוקן ובדיוק לפני שליחת התשובה
    console.log(`Registration succeeded for user: ${userName}`);
    res.json({
      token,
      user: {
        id: newUser.id,
        name,
        userName,
        email,
      },
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🔐 התחברות
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(`Login attempt: ${userName} password received`);

    // שליפת המשתמש לפי user_userName
    const users = await genericServices.getRecordsByColumn("users", "user_userName", userName);
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = users[0];
    console.log("User found:", user);

    // שליפת סיסמה מוצפנת מהטבלה
    const passwords = await genericServices.getRecordsByColumn("passwords", "user_id", user.user_id);
    if (passwords.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const passwordHash = passwords[0].password;
    console.log(`Comparing password to hash: ${password} ${passwordHash}`);

    // השוואת הסיסמה מול ההאש
    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      console.log("Password mismatch for user:", userName);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // יצירת טוקן
    const token = jwt.sign(
      { userId: user.user_id, userName: user.user_userName },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // אחרי יצירת הטוקן ובדיוק לפני שליחת התשובה
    console.log(`Login succeeded for user: ${userName}`);
    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.user_name,
        userName: user.user_userName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
