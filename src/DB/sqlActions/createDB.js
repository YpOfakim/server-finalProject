var mysql = require("mysql2");
var path = require("path");

function createDB() {
  //כשמחזירים למשתנה הסביבה אז להחליף בין הקודים
  // console.log(process.env.DB_HOST);
  // var connection = mysql.createConnection({
  //   host:process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASS
  // });
    console.log("localhost");
  var connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "Ofakim123"
  });

  connection.query(`CREATE DATABASE ahavtiServer`, function (err, result) {
    if (err) throw err;
    console.log(`${process.env.DB_NAME} created`);
  });
}
createDB();
module.exports = createDB;