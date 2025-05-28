var path = require("path");
var mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

// console.log(process.env.DB_USER,process.env.DB_PASS);


//כשמחזירים למשתנה הסביבה אז להחליף בין הקודים
// var connection = mysql.createConnection({
//   host:process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database:process.env.DB_NAME
//   });
  
var connection = mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "Ofakim123",
  database:"ahavtiServer"
  });
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected successfuly");
  });
  
  module.exports = connection;
  