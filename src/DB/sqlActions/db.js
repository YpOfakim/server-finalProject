var path = require("path");
var mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

const pool = mysql.createPool({
  host:"localhost",
  user: "root",
  password: "Ofakim123",
  database:"ahavtiServer",
  port: process.env.PORT_MYSQL || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

module.exports = pool.promise();