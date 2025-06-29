const express = require("express");
const genericServices = require("../Services/genericServices");
const { getAllSegments } = require('./utils/dailySegmentManager');

const router = express.Router();
console.log("📦 daily_segmentsRoutes loaded");

router.get("/", async (req, res) => {
    try {
        const daily_segments = await genericServices.getAllRecords("daily_segments");
        res.status(200).json(daily_segments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/daily/daily-page', async (req, res) => {
  const { date } = req.query;
  console.log("📌 בקשה התקבלה עם date:", date);

  if (!date) {
    return res.status(400).send('Missing date');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).send(`Invalid date format: ${date}`);
  }

  try {
    const segment = await getSegmentByDate(date); // מביא את הנתיב ל-PDF והעמודים לפי התאריך

    if (!segment) {
      return res.status(404).send('Segment not found');
    }

    const { segment_pdf_url, start_page } = segment;
    console.log(`📄 מנסה להמיר PDF: ${segment_pdf_url}, עמוד: ${start_page}`);

    const imageBuffer = await convertPdfPageToImage(segment_pdf_url, start_page);

    res.contentType('image/png');
    res.send(imageBuffer);
  } catch (err) {
    console.error("❌ שגיאה:", err);
    res.status(500).send('Server error');
  }
});

router.get('/all-daily-pages', async (req, res) => {
    console.log("📥 נכנסו לנתיב all-daily-pages");
    try {
      const allSegments = await getAllSegments();
  
      // המרת התאריכים לזמן מקומי בפורמט קריא
      const convertedSegments = allSegments.map(segment => {
        const localDate = new Date(segment.segment_date);
        return {
          ...segment,
          segment_date: localDate.toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })
        };
      });
  
      res.json(convertedSegments);
    } catch (error) {
      console.error('שגיאה בשליפת החיזוקים:', error);
      res.status(500).send('שגיאה בשרת');
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