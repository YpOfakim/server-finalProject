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
  // החזרת השדה המתאים לפי הטבלה
  if (tableName === 'users') {
    return { user_id: result.insertId, ...record };
  }
  if (tableName === 'passwords') {
    return { user_id: record.user_id, ...record };
  }
  return { id: result.insertId, ...record };
}


async function deleteRecord(tableName, columnName, id) {
    await db.query(`DELETE FROM ?? WHERE ?? = ?`, [tableName, columnName, id]);
}

async function updateRecord(tableName, columnName, id, record) {
    await db.query(`UPDATE ?? SET ? WHERE ?? = ?`, [tableName, record, columnName, id]);
    return { id, ...record };
}

async function getRecordsByColumn(tableName, columnName, value) {
    const [rows] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tableName, columnName, value]);
    return rows;
}async function getRecordsWithOperator(tableName, columnName, operator, value) {
  const query = `SELECT * FROM ?? WHERE ?? ${operator} ?`;
  const [rows] = await db.query(query, [tableName, columnName, value]);
  return rows;
}async function getRecordsOrdered(tableName, orderByColumn, direction = 'ASC') {
  const validDirections = ['ASC', 'DESC'];
  if (!validDirections.includes(direction.toUpperCase())) {
    throw new Error('Invalid sort direction');
  }

  const query = `SELECT * FROM ?? ORDER BY ?? ${direction}`;
  const [rows] = await db.query(query, [tableName, orderByColumn]);
  return rows;
}

// async function getRecordsOrderedByDistance(tableName, lat, lng, time_from = null) {
//   let query = `
//     SELECT *, ST_Distance_Sphere(point(longitude, latitude), point(?, ?)) AS distance_meters
//     FROM ??
//   `;
//   const params = [lng, lat, tableName];

//   if (time_from) {
//     query += " WHERE time_and_date >= ?";
//     params.push(time_from);
//   }

//   query += " ORDER BY distance_meters ASC";

//   const [rows] = await db.query(query, params);
//   return rows;
// }


module.exports = {getAllRecords,getRecordById,createRecord,deleteRecord,updateRecord,getRecordsByColumn,getRecordsWithOperator,getRecordsOrdered};