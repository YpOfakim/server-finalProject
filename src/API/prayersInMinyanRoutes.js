const express = require("express");
const db = require("../DB/sqlActions/db");
const genericServices = require("../Services/genericServices");

const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware");

// בשרת (express)
router.get("/",verifyToken, async (req, res) => {
  const { user_id, minyan_id } = req.query;
  try {
    let prayers_in_minyan;
    if (user_id && minyan_id) {
      prayers_in_minyan = await genericServices.getRecordsByColumns("prayersInMinyan", {
        user_id,
        minyan_id
      });
    } else if (user_id) {
      prayers_in_minyan = await genericServices.getRecordsByColumn("prayersInMinyan", "user_id", user_id);
    } else if (minyan_id) {
      prayers_in_minyan = await genericServices.getRecordsByColumn("prayersInMinyan", "minyan_id", minyan_id);
    } else {
      prayers_in_minyan = await genericServices.getAllRecords("prayersInMinyan");
    }
    res.status(200).json(prayers_in_minyan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/",verifyToken, async (req, res) => {
  try {
    const { minyan_id, user_id } = req.body;

    // שליפת זמן המניין הנוכחי
    const minyan = await genericServices.getRecordById("minyans", "minyan_id", minyan_id);
    if (!minyan) {
      return res.status(400).json({ error: "Minyan not found" });
    }
    const minyanTime = new Date(minyan.time_and_date);

    // שליפת כל המניינים אליהם המשתמש רשום
    const userMinyanJoins = await genericServices.getRecordsByColumn("prayersInMinyan", "user_id", user_id);
    console.log("User Minyan Joins:", userMinyanJoins);
    

    // בדיקה אם יש חפיפה של חצי שעה
    for (const join of userMinyanJoins) {
      const otherMinyan = await genericServices.getRecordById("minyans", "minyan_id", join.minyan_id);
      if (otherMinyan) {
        const otherTime = new Date(otherMinyan.time_and_date);
        const diffMinutes = Math.abs((minyanTime - otherTime) / (1000 * 60));

        // בדיקת חפיפה של חצי שעה
        if (diffMinutes < 30) {
          return res.status(400).json({ error: "כבר הצטרפת למניין אחר בטווח של חצי שעה" });
        }

        // בדיקת זמן נסיעה
        const distance = getDistanceFromLatLonInKm(
          minyan.latitude, minyan.longitude,
          otherMinyan.latitude, otherMinyan.longitude
        );
        const avgSpeedKmh = 50; // מהירות ממוצעת
        const travelTimeMinutes = (distance / avgSpeedKmh) * 60;

        // אם המניין השני נגמר פחות מ-20 דקות לפני תחילת המניין הנוכחי, ואין מספיק זמן נסיעה
        if (otherTime < minyanTime && (minyanTime - otherTime) / (1000 * 60) < (20 + travelTimeMinutes)) {
          return res.status(400).json({ error: "אין מספיק זמן נסיעה בין המניינים" });
        }
      }
    }

    // אם אין חפיפה, מוסיפים
    const newprayerInMinyan = await genericServices.createRecord("prayersInMinyan", req.body);
    res.status(201).json(newprayerInMinyan);
  } catch (error) {
    console.error("POST /prayersInMinyan error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/count/:minyan_id',verifyToken, async (req, res) => {
  const { minyan_id } = req.params;
  try {
    const results = await genericServices.getRecordsByColumn("prayersInMinyan", "minyan_id", minyan_id);
    res.json({ count: results.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch count" });
  }
});

// ✅ ביטול הצטרפות לפי user_id + minyan_id
router.delete("/",verifyToken, async (req, res) => {
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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

module.exports = router;
