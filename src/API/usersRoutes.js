const express = require("express");
const genericServices = require("../Services/genericServices");

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
        const newUsers = await genericServices.createRecord("users", user);
        res.status(201).json(newUsers);
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