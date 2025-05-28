
const express = require("express");
const genericServices = require("../Services/genericServices");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const passwords = await genericServices.getAllRecords("passwords");
        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const password = await genericServices.getRecordById("passwords", "dpassword_id", id);
        res.status(200).json(password);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const password = req.body;
        const newPasswords = await genericServices.createRecord("passwords", password);
        res.status(201).json(newPasswords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("passwords", "password_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const password = req.body;
        const updatedPassword = await genericServices.updateRecord("passwords", "password_id", id, password);
        res.status(200).json(updatedPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;