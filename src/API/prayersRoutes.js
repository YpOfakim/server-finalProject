const express = require("express");
const genericServices = require("../Services/genericServices");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const prayers = await genericServices.getAllRecords("prayers");
        res.status(200).json(prayers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const prayer = await genericServices.getRecordById("prayers", "prayer_id", id);
        res.status(200).json(prayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const prayer = req.body;
        const newPrayers = await genericServices.createRecord("prayers", prayer);
        res.status(201).json(newPrayers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("prayers", "prayer_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const prayer = req.body;
        const updatedPrayer = await genericServices.updateRecord("prayers", "prayer_id", id, prayer);
        res.status(200).json(updatedPrayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;