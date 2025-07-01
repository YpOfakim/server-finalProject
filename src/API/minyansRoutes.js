// File: routes/minyans.js
const express = require("express");
const genericServices = require("../Services/genericServices");
const { verifyToken } = require("../Middleware/authMiddleware");
const { geocodeAddress, reverseGeocode } = require("../API/utils/geocodeManager"); // שינוי כאן

const router = express.Router();

// GET all minyans
router.get("/", verifyToken, async (req, res) => {
  try {
    let { time_from } = req.query;

    if (!time_from) {
      time_from = new Date().toISOString();
    }

    let minyans = await genericServices.getRecordsWithOperator("minyans", "time_and_date", ">=", time_from);
    minyans.sort((a, b) => new Date(a.time_and_date) - new Date(b.time_and_date));

    res.status(200).json(minyans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single minyan by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const minyan = await genericServices.getRecordById("minyans", "minyan_id", id);
    res.status(200).json(minyan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new minyan
router.post("/", verifyToken, async (req, res) => {
  try {
    const opener_id = req.userId;
    const { time, location, address } = req.body;

    let latitude = null;
    let longitude = null;
    let finalAddress = address || null;

    if (location && location.lat && location.lng) {
      latitude = location.lat;
      longitude = location.lng;
      if (!finalAddress) {
        finalAddress = await reverseGeocode(latitude, longitude);
      }
    } else if (address) {
      const coords = await geocodeAddress(address);
      latitude = coords.lat;
      longitude = coords.lng;
    } else {
      return res.status(400).json({ error: "Missing location or address" });
    }

    const newMinyan = await genericServices.createRecord("minyans", {
      time_and_date: time,
      latitude,
      longitude,
      address: finalAddress,
      opener_id
    });
    console.log(newMinyan);

    await genericServices.createRecord("prayersInMinyan", {
      minyan_id: newMinyan.minyan_id,
      user_id: opener_id
    });

    res.status(201).json({ message: "Minyan created and user added", minyan: newMinyan });
  } catch (err) {
    console.error("Error in POST /minyans:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

module.exports = router;
