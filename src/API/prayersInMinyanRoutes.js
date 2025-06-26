const express = require("express");
const db = require("../DB/sqlActions/db");
const genericServices = require("../Services/genericServices");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const prayers_in_minyan = await genericServices.getAllRecords("prayersInMinyan");
    res.status(200).json(prayers_in_minyan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const prayerInMinyan = req.body;
    const newprayerInMinyan = await genericServices.createRecord("prayersInMinyan", prayerInMinyan);
    res.status(201).json(newprayerInMinyan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/count/:minyan_id', async (req, res) => {
  const { minyan_id } = req.params;
  try {
    const results = await genericServices.getRecordsByColumn("prayersInMinyan", "minyan_id", minyan_id);
    res.json({ count: results.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch count" });
  }
});

// ✅ ביטול הצטרפות לפי user_id + minyan_id
router.delete("/", async (req, res) => {
  const { user_id, minyan_id } = req.body;
  try {
    await db.query(
      'DELETE FROM prayersInMinyan WHERE user_id = ? AND minyan_id = ?',
      [user_id, minyan_id]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel participation" });
  }
});

module.exports = router;
