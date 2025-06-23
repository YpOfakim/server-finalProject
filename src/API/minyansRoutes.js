const express = require("express");
const genericServices = require("../Services/genericServices");


const router = express.Router();

const GOOGLE_API_KEY = 'AIzaSyCVdsExOdchWIspVTLcCOgScugWBmgBllw';

// Helper to get coordinates from address
async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.results.length > 0) {
    return data.results[0].geometry.location;
  } else {
    throw new Error("Failed to geocode address");
  }
}

// GET all minyans

router.get("/", async (req, res) => {
  try {
    let { time_from } = req.query;

    if (!time_from) {
      time_from = new Date().toISOString(); // תאריך ושעה נוכחיים ב-ISO
    }

    // סינון לפי זמן מהמניין ואילך
    let minyans = await genericServices.getRecordsWithOperator("minyans", "time_and_date", ">=", time_from);
    
    minyans.sort((a, b) => new Date(a.time_and_date) - new Date(b.time_and_date)); // מיון לפי זמן עולה

    res.status(200).json(minyans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// GET single minyan by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const minyan = await genericServices.getRecordById("minyans", "minyan_id", id);
    res.status(200).json(minyan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new minyan
router.post("/", async (req, res) => {
  try {
    const { time, location, address, opener_phone, is_daily } = req.body;

    let latitude = null;
    let longitude = null;

    if (location && location.lat && location.lng) {
      latitude = location.lat;
      longitude = location.lng;
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
      address: address || null,
      opener_phone,
      is_daily,
    });

    res.status(201).json({ message: "Minyan created successfully", minyan: newMinyan });
  } catch (err) {
    console.error("Error in POST /minyans:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// PUT update minyan
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedMinyan = await genericServices.updateRecord("minyans", "minyan_id", id, req.body);
    res.status(200).json(updatedMinyan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE minyan
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await genericServices.deleteRecord("minyans", "minyan_id", id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
