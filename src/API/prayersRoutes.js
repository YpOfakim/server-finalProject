const express = require("express");
const genericServices = require("../Services/genericServices");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const db = require("../DB/sqlActions/db");  
// const Tesseract = require('tesseract.js');
const { exec } = require("child_process");
// require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

// const popplerPath = `"K:\\React\\npm\\FinelProject\\poppler-24.08.0\\Library\\bin\\pdftoppm.exe"`;
const popplerPath = `"C:\\Users\\neomi\\source\\repos\\poppler-24.08.0\\Library\\bin\\pdftoppm.exe"`;
const pdfPath = path.join(__dirname, "..", "Prayers_And_Segments_Files", "Sidur.pdf");
const imagesDir = path.resolve(__dirname, "..", "Prayers_And_Segments_Files", "tempPictures");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const prayers = await genericServices.getAllRecords("prayers");
        res.status(200).json(prayers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.use("/image", express.static(imagesDir));

router.get("/images/:name", async (req, res) => {
  const prayerName = req.params.name;

  try {
    const [rows] = await db.query(
      `SELECT * FROM prayers WHERE prayer_name = ?`,
      [prayerName]
    );

    if (rows.length === 0) {
      return res.status(404).send("תפילה לא נמצאה");
    }

    const prayer = rows[0];
    const start = prayer.start_page;
    const end = prayer.end_page;

    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    const missingPages = [];
    for (let i = start; i <= end; i++) {
      const pageStr = i.toString().padStart(3, "0");
      const imagePath = path.join(imagesDir, `page-${pageStr}.png`);
      if (!fs.existsSync(imagePath)) {
        missingPages.push(i);
      }
    }

    // אם חסרים קבצים – נייצר אותם
    if (missingPages.length > 0) {
      const minPage = Math.min(...missingPages);
      const maxPage = Math.max(...missingPages);
      const outputPrefix = path.join(imagesDir, "page");

      const command = `${popplerPath} -f ${minPage} -l ${maxPage} -png "${pdfPath}" "${outputPrefix}"`;
      console.log("מריץ:", command);

      await new Promise((resolve, reject) => {
        exec(command, (error) => {
          if (error) return reject(error);
          resolve();
        });
      });
    }

    // מחזיר את הנתיבים של התמונות
    const imageURLs = [];
    for (let i = start; i <= end; i++) {
      const pageStr = i.toString().padStart(3, "0");
      imageURLs.push(`/prayers/image/page-${pageStr}.png`);
    }

    res.json(imageURLs);
  } catch (err) {
    console.error("שגיאה:", err);
    res.status(500).send("שגיאה בשרת");
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