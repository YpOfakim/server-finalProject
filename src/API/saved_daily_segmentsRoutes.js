const express = require("express");
const genericServices = require("../Services/genericServices");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const saved_daily_segments = await genericServices.getAllRecords("saved_daily_segments");
        res.status(200).json(saved_daily_segments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const saved_daily_segment = await genericServices.getRecordById("saved_daily_segments", "saved_daily_segment_id", id);
        res.status(200).json(saved_daily_segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const saved_daily_segment = req.body;
        const newSaved_daily_segments = await genericServices.createRecord("saved_daily_segments", saved_daily_segment);
        res.status(201).json(newSaved_daily_segments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("saved_daily_segments", "saved_daily_segment_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const saved_daily_segment = req.body;
        const updatedSaved_daily_segment = await genericServices.updateRecord("saved_daily_segments", "saved_daily_segment_id", id, saved_daily_segment);
        res.status(200).json(updatedSaved_daily_segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;