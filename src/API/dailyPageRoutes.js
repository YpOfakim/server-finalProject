const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const router = express.Router();

const { getSegmentByDate } = require("./utils/dailySegmentManager");

const PDF_PATH = path.resolve(__dirname, "..", "Prayers_And_Segments_Files", "Aavti.pdf");
const OUTPUT_DIR = path.resolve(__dirname, "..", "Prayers_And_Segments_Files", "DailyPages");
const pdftoppmPath = `"K:\\React\\npm\\FinelProject\\poppler-24.08.0\\Library\\bin\\pdftoppm.exe"`;

// מייצרת את התמונה מה-PDF
function generatePageImage(pageNumber, callback) {
  const outputPrefix = path.join(OUTPUT_DIR, "daily");
  const command = `${pdftoppmPath} -f ${pageNumber} -l ${pageNumber} -png "${PDF_PATH}" "${outputPrefix}"`;

  exec(command, (error) => {
    if (error) {
      console.error("❌ שגיאה ביצירת התמונה:", error);
      return callback(error);
    }
    callback(null);
  });
}

function getImageFilePath(pageNumber) {
  const padded = String(pageNumber).padStart(3, '0'); // יוצר "036"
  return path.join(OUTPUT_DIR, `daily-${padded}.png`);
}

// יוצרת את הנתיב החדש לפי התאריך בטבלה
router.get("/daily-page", async (req, res) => {
  try {
    const dateStr = req.query.date;
    if (!dateStr) return res.status(400).send("Missing date parameter");

    const segment = await getSegmentByDate(dateStr);
    if (!segment) {
      return res.status(404).send("❌ לא נמצא חיזוק לתאריך זה");
    }

    const pageNumber = segment.start_page;
    const imagePath = getImageFilePath(pageNumber);

    if (!fs.existsSync(imagePath)) {
      // ודא שהתיקייה קיימת
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      // יצירת התמונה ואז שליחה
      generatePageImage(pageNumber, (err) => {
        if (err) {
          console.error("❌ שגיאה ביצירת התמונה:", err);
          return res.status(500).send("שגיאה ביצירת תמונה יומית");
        }

        // רק עכשיו התמונה קיימת
        if (!fs.existsSync(imagePath)) {
          return res.status(500).send("❌ תמונה לא נוצרה למרות ניסיון יצירה");
        }

        res.sendFile(imagePath);
      });
    } else {
      // אם התמונה כבר קיימת – שלח מיד
      res.sendFile(imagePath);
    }
  } catch (err) {
    console.error("❌ שגיאה כללית:", err);
    res.status(500).send("Something broke! - " + err.message);
  }
});
module.exports = router;
