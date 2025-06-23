// utils/dailySegmentManager.js
const db = require('../../DB/sqlActions/db');
const path = require("path");

async function getOrCreateTodaySegment() {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  try {
    // בדיקה אם יש כבר חיזוק לתאריך של היום
    const [existingRows] = await db.query(
      `SELECT * FROM daily_segments WHERE segment_date = ?`,
      [today]
    );

    if (existingRows.length > 0) {
      return existingRows[0];
    }

    // שליפת החיזוק האחרון לפי תאריך
    const [latestRows] = await db.query(
      `SELECT * FROM daily_segments ORDER BY segment_date DESC LIMIT 1`
    );

    if (latestRows.length === 0) {
      throw new Error("No existing daily segments to continue from.");
    }

    const last = latestRows[0];

    const newSegment = {
      segment_date: today,
      segment_pdf_url: last.segment_pdf_url,
      start_page: last.end_page,
      end_page: last.end_page + 1,
    };

    // הוספת השורה החדשה למסד הנתונים
    await db.query(
      `INSERT INTO daily_segments (segment_date, segment_pdf_url, start_page, end_page)
       VALUES (?, ?, ?, ?)`,
      [
        newSegment.segment_date,
        newSegment.segment_pdf_url,
        newSegment.start_page,
        newSegment.end_page,
      ]
    );

    return newSegment;
  } catch (err) {
    console.error("שגיאה בטיפול בחיזוק יומי:", err);
    throw err;
  }
}

module.exports = { getOrCreateTodaySegment };
