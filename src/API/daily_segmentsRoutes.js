const express = require("express");
const genericServices = require("../Services/genericServices");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const daily_segments = await genericServices.getAllRecords("daily_segments");
        res.status(200).json(daily_segments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const daily_segment = await genericServices.getRecordById("daily_segments", "daily_segment_id", id);
        res.status(200).json(daily_segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const daily_segment = req.body;
        const newDaily_segments = await genericServices.createRecord("daily_segments", daily_segment);
        res.status(201).json(newDaily_segments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("daily_segments", "daily_segment_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const daily_segment = req.body;
        const updatedDaily_segment = await genericServices.updateRecord("daily_segments", "daily_segment_id", id, daily_segment);
        res.status(200).json(updatedDaily_segment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;