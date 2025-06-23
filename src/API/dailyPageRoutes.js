// קובץ: dailyPageRoute.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
// const db = require("../DB/sqlActions/db"); // אם יש צורך בגישה לבסיס נתונים
const router = express.Router();
const { getOrCreateTodaySegment } = require("./utils/dailySegmentManager");


const PDF_PATH = path.resolve(__dirname, "..", "Prayers_And_Segments_Files", "Aavti.pdf");
const OUTPUT_DIR = path.resolve(__dirname, "..", "Prayers_And_Segments_Files", "DailyPages");
const pdftoppmPath = `C:\\Users\\neomi\\source\\repos\\poppler-24.08.0\\Library\\bin\\pdftoppm.exe`;

// מחזירה את מספר הדפים בקובץ
function getTodayPageNumber(totalPages) {
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return (daysSinceEpoch % totalPages) + 1;
}

// מחזירה את שם הקובץ של התמונה עבור עמוד מסוים
function getImageFilePath(pageNumber) {
  const pageStr = pageNumber.toString().padStart(3, "0");
  return path.join(OUTPUT_DIR, `daily-${pageStr}.png`);
}

// מייצרת את התמונה מה-PDF במידת הצורך
function generatePageImage(pageNumber, callback) {
  const outputPrefix = path.join(OUTPUT_DIR, "daily");
  const command = `${pdftoppmPath} -f ${pageNumber} -l ${pageNumber} -png "${PDF_PATH}" "${outputPrefix}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("שגיאה ביצירת התמונה:", error);
      return callback(error);
    }
    callback(null);
  });
}

router.get("/daily-page", async (req, res) => {
  try {
    const todaySegment = await getOrCreateTodaySegment(); // יוצר או מחזיר את השורה של היום
    const pageNumber = todaySegment.start_page;
    const imagePath = getImageFilePath(pageNumber);

    if (!fs.existsSync(imagePath)) {
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
      generatePageImage(pageNumber, (err) => {
        if (err) return res.status(500).send("שגיאה ביצירת תמונה יומית");
        res.sendFile(imagePath);
      });
    } else {
      res.sendFile(imagePath);
    }
  } catch (err) {
    console.error("שגיאה כללית:", err);
    res.status(500).send("שגיאה בטעינת הדף היומי");
  }
});

module.exports = router;
