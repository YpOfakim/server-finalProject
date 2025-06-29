// utils/dailySegmentManager.js
const db = require('../../DB/sqlActions/db');
const path = require("path");

async function getOrCreateTodaySegment() {
  function getLocalDateOnly() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const today = getLocalDateOnly();

  try {
    const [existingRows] = await db.query(
      `SELECT * FROM daily_segments WHERE segment_date = ?`,
      [today]
    );

    if (existingRows.length > 0) {
      return existingRows[0];
    }

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

async function getAllSegments() {
  try {
    console.log("🔍 מבצע שליפת כל החיזוקים מה־DB");

    const query = `
      SELECT 
        daily_segments_id,
        segment_pdf_url,
        start_page,
        end_page,
        DATE_FORMAT(segment_date, '%Y-%m-%d') AS segment_date
      FROM daily_segments
      ORDER BY segment_date DESC
    `;

    const [rows] = await db.query(query);
    console.log("✅ חיזוקים שנשלפו:", rows);
    return rows;
  }
  catch (err) {
    console.error("❌ שגיאה בשליפת כל החיזוקים:", err);
    throw err;
  }
}
async function getSegmentByDate(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date string provided: "${dateStr}"`);
  }

  const [rows] = await db.query(
    "SELECT * FROM daily_segments WHERE segment_date = ?",
    [dateStr]
  );
  return rows[0] || null;
}

module.exports = {
  getOrCreateTodaySegment,
  getAllSegments,
  getSegmentByDate
};

