const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const genericServices = require("../Services/genericServices");
const SECRET_KEY = process.env.JWT_SECRET || "Yoanna@Neomi%FinalProjectSecretKey";

// 🔐 רישום משתמש חדש
router.post("/register", async (req, res) => {
  try {
    const { user_name, user_userName, email, password, phone } = req.body;

    if (!user_name || !user_userName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUsers = await genericServices.getRecordsByColumn("users", "user_userName", user_userName);
    if (existingUsers.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await genericServices.createRecord("users", {
      user_name,
      user_userName,
      email,
      phone,
    });

    const passwordHash = await bcrypt.hash(password, 10);

    await genericServices.createRecord("passwords", {
      user_id: newUser.user_id,
      password: passwordHash,
    });

    const token = jwt.sign(
      { userId: newUser.user_id, userName: user_userName },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        user_id: newUser.user_id,
        user_name: newUser.user_name,
        user_userName: newUser.user_userName,
        email: newUser.email,
        phone: newUser.phone,
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
    console.log(`Login attempt: ${userName}`);

    // בדיקת שדות ריקים
    if (!userName || !password) {
      return res.status(400).json({ message: "יש למלא שם משתמש וסיסמה" });
    }

    // חיפוש משתמש לפי user_userName
    const users = await genericServices.getRecordsByColumn("users", "user_userName", userName);
    if (users.length === 0) {
      return res.status(404).json({ message: "שם המשתמש לא קיים" });
    }

    const user = users[0];
    console.log("User found:", user);

    // חיפוש סיסמה לפי user_id
    const passwords = await genericServices.getRecordsByColumn("passwords", "user_id", user.user_id);
    if (passwords.length === 0) {
      return res.status(500).json({ message: "אין סיסמה משויכת למשתמש זה" });
    }

    const passwordHash = passwords[0].password;
    console.log(`Comparing password for ${userName}`);

    // השוואת סיסמה
    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "סיסמה שגויה" });
    }

    // יצירת טוקן
    const token = jwt.sign(
      { userId: user.user_id, user_userName: user.user_userName },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    console.log(`Login succeeded for user: ${userName}`);

    res.json({
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_userName: user.user_userName,
        email: user.email,
        phone: user.phone
      },
    });

  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "שגיאה בשרת. נסה שוב מאוחר יותר." });
  }
});


module.exports = router;
