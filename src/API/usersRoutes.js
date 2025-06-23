const express = require("express");
const genericServices = require("../Services/genericServices");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "Yoanna@Neomi%FinalProjectSecretKey";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await genericServices.getAllRecords("users");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await genericServices.getRecordById("users", "user_id", id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    console.log("user from body:", user);

    // מיפוי שמות השדות לשמות העמודות במסד הנתונים
    const dbUser = {
      user_name: user.name,
      user_userName: user.userName,
      email: user.email,
  
      phone: user.phone
    };
    const dbUserPassword = {
        password: user.password
    };

    // יצירת משתמש חדש במסד נתונים
    const newUser = await genericServices.createRecord("users", dbUser);
    const password = await genericServices.createRecord("passwords", dbUserPassword);

    console.log("newUser from DB:", newUser);

    // יצירת טוקן JWT
    const token = jwt.sign(
      { userId: newUser.insertId || newUser.user_id },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      token,
      user: {
        id: newUser.insertId || newUser.user_id,
        name: dbUser.user_name,
        userName: dbUser.user_userName,
        email: dbUser.email,
        phone: dbUser.phone
      }
    });
  } catch (error) {
    console.error("Error in POST /users:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("users", "user_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.body;
        const updatedUser = await genericServices.updateRecord("users", "user_id", id, user);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;