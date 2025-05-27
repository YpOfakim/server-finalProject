const express = require("express");
const genericServices = require("../Services/genericServices");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const notes = await genericServices.getAllRecords("notes ");
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const note = await genericServices.getRecordById("notes", "note_id", id);
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const note = req.body;
        const newNotes = await genericServices.createRecord("notes", note);
        res.status(201).json(newNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("notes", "note_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const notes = req.body;
        const updatedNote = await genericServices.updateRecord("notes", "note_id", id, notes);
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;