const express = require("express");
const genericServices = require("../Services/genericServices");
const router = express.Router();


// החזרת כל הטבלה notes
router.get('/', async (req, res) => {
    try {
      const rows = await genericServices.getAllRecords("notes");
      console.log("Rows returned:", rows);
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'שגיאה בקבלת ההערות' });
    }
});

  router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const notes = await genericServices.getRecordsByField('notes', 'user_id', userId);
      res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
// קבלת הערה לפי תאריך ו־userId
router.get('/', async (req, res) => {
    const { date, userId } = req.query;
  
    if (!date || !userId) {
      return res.status(400).json({ error: 'Missing required query params' });
    }
  
    try {
      // שימוש בפונקציה גנרית לקבלת רשומות לפי תנאים
      const rows = await genericServices.getRecordsByConditions('notes', { note_date: date, user_id: userId });
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'לא נמצאה הערה' });
      }
  
      // מחזיר רק את ההערה הראשונה
      res.json({
        note: rows[0].body,
        title: rows[0].note_title,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'שגיאה בקבלת ההערה' });
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const note = await genericServices.getRecordById("notes", "note_id", id);
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
  const { userId, date, note, title } = req.body;

  if (!userId || !date || !note || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // הכנת האובייקט להוספה
    const record = {
      user_id: userId,
      body: note,
      note_date: date,
      note_title: title,
    };

    const newNote = await genericServices.createRecord('notes', record);

    res.status(201).json({ message: 'ההערה נשמרה בהצלחה', noteId: newNote.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בשמירת ההערה' });
  }
});
  
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await genericServices.deleteRecord("notes", "note_id", id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const notes = req.body;
        const updatedNote = await genericServices.updateRecord("notes", "note_id", id, notes);
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;