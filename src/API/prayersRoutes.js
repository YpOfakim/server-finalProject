const express = require("express");
const genericServices = require("../Services/genericServices");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const db = require("../DB/sqlActions/db");  // הסתמך על הקוד שלך למסד


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const prayers = await genericServices.getAllRecords("prayers");
        res.status(200).json(prayers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/text/:name", async (req, res) => {
  const prayerName = req.params.name;

  try {
    // שליפת פרטי התפילה מהמסד לפי השם
    const [rows] = await db.query(
      `SELECT * FROM prayers WHERE prayer_name = ?`,
      [prayerName]
    );

    if (rows.length === 0) {
      return res.status(404).send("תפילה לא נמצאה");
    }

    const prayer = rows[0];

    // קריאה לקובץ ה-PDF שנמצא בשרת
    const pdfPath = path.join(__dirname, "..", "Prayers_And_Segments_Files", "Sidur.pdf");
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);

    // חלוקה לטקסט לפי עמודים - בפורמט של pdf-parse העמודים מופרדים בדרך כלל ב '\f' (Form Feed)
    const allPages = pdfData.text.split('\f');

    // חיתוך הטקסט לפי עמודי ההתחלה והסיום מתוך מסד הנתונים
    const selectedPages = allPages.slice(prayer.start_page - 1, prayer.end_page);

    // איחוד העמודים לבלוק טקסט אחד
    const text = selectedPages.join('\n\n');

    // החזרת הטקסט ללקוח
    res.send(text);

  } catch (err) {
    console.error(err);
    res.status(500).send("שגיאה בקריאת התפילה");
  }
});

router.get("/by-name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const rows = await genericServices.getRecordsByColumn("prayers", "prayer_name", name);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    // מחזיר רק את העמודים הרלוונטיים לקליינט
    const { prayer_name, prayers_pdf_url: pdf_url, start_page, end_page } = rows[0];
    res.status(200).json({ prayer_name, pdf_url, start_page, end_page });
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