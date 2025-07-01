const express = require("express");
const genericServices = require("../Services/genericServices");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "Yoanna@Neomi%FinalProjectSecretKey";
const { verifyToken } = require("../Middleware/authMiddleware");

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

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("users", "user_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id",verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.body;
    console.log("Updating user ID:", id);
    console.log("Data received:", user);

    const updatedUser = await genericServices.updateRecord("users", "user_id", id, user);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);  // <=== זה הכי חשוב
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;