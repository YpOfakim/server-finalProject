// dailyCron.js
const cron = require("node-cron");
const { getOrCreateTodaySegment } = require("./src/API/utils/dailySegmentManager");

console.log("📆 מתזמן את יצירת החיזוק היומי...");

cron.schedule("0 2 * * *", async () => {
  console.log("🕑 מריץ יצירת חיזוק יומי...");
  try {
    const segment = await getOrCreateTodaySegment();
    console.log("✅ חיזוק יומי נוצר:", segment);
  } catch (err) {
    console.error("❌ שגיאה ביצירת חיזוק יומי:", err.message);
  }
});


//קוד חד פעמי להרצת חיזוק יומי ידני
// ניתן להריץ את הקוד הזה כדי ליצור חיזוק יומי מיידית,

// (async () => {
//   console.log("🕑 מריץ חיזוק יומי ידני...");
//   try {
//     const segment = await getOrCreateTodaySegment();
//     console.log("✅ חיזוק יומי נוצר:", segment);
//   } catch (err) {
//     console.error("❌ שגיאה ביצירת חיזוק יומי:", err.message);
//   }
// })();
