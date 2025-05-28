var mysql = require("mysql2");
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים
const conDB = require("./connectToDB");

function cleanDB() {
  conDB.query(
    `DROP DATABASE IF EXISTS ahavtiServer`,
    function (err, result) {
      if (err) throw err;
      console.log("Database dropped");
    }
  );
}

cleanDB();
module.exports = cleanDB;
