const db=require("../DB/sqlActions/db")

async function getAllRecords(tableName) {
    const [rows] = await db.query(`SELECT * FROM ??`, [tableName]);
    return rows;
}

async function getRecordById(tableName, columnName, id) {
    const [rows] = await db.query(
        `SELECT * FROM ?? WHERE ?? = ?`,
        [tableName, columnName, id]
    );
    return rows[0];
}

async function createRecord(tableName, record) {
  const [result] = await db.query(`INSERT INTO ?? SET ?`, [tableName, record]);

  // החזרת מזהה נכון לפי שם הטבלה
  if (tableName === 'users') {
    return { user_id: result.insertId, ...record };
  }
  return { id: result.insertId, ...record };
}



async function deleteRecord(tableName, columnName, id) {
    await db.query(`DELETE FROM ?? WHERE ?? = ?`, [tableName, columnName, id]);
}

async function updateRecord(tableName, columnName, id, record) {
  // ניפוי שדות שלא קיימים בטבלה או שלא צריכים להישלח
  const { id: _, user_id: __, ...cleanedRecord } = record;

  await db.query(`UPDATE ?? SET ? WHERE ?? = ?`, [
    tableName,
    cleanedRecord,
    columnName,
    id,
  ]);
  return { [columnName]: id, ...cleanedRecord };
}


async function getRecordsByColumn(tableName, columnName, value) {
    const [rows] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tableName, columnName, value]);
    return rows;
}
async function getRecordsWithOperator(tableName, columnName, operator, value) {
  const query = `SELECT * FROM ?? WHERE ?? ${operator} ?`;
  const [rows] = await db.query(query, [tableName, columnName, value]);
  return rows;
}
async function getRecordsOrdered(tableName, orderByColumn, direction = 'ASC') {
  const validDirections = ['ASC', 'DESC'];
  if (!validDirections.includes(direction.toUpperCase())) {
    throw new Error('Invalid sort direction');
  }

  const query = `SELECT * FROM ?? ORDER BY ?? ${direction}`;
  const [rows] = await db.query(query, [tableName, orderByColumn]);
  return rows;
}
async function getRecordsByConditions(tableName, conditions) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);

  const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
  const sql = `SELECT * FROM ?? WHERE ${whereClause}`;

  const [rows] = await db.query(sql, [tableName, ...values]);
  return rows;
}




module.exports = {getRecordsByConditions,getAllRecords,getRecordById,createRecord,deleteRecord,updateRecord,getRecordsByColumn,getRecordsWithOperator,getRecordsOrdered};
