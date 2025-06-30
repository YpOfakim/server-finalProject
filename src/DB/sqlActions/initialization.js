
var path = require("path");
const conDB = require("./connectToDB");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים
    "../sqlTables/users.sql",
    "../sqlTables/minyans.sql",
    "../sqlTables/daily_segments.sql",
    "../sqlTables/notes.sql",
    "../sqlTables/passwords.sql",
    "../sqlTables/prayers.sql"
   

    // // הכנסת נתונים התחלתיים לטבלת users
    async function initializeDB() {
    // // Clear existing data from all tables
    // await conDB.promise().query("DELETE FROM prayers");
    // await conDB.promise().query("DELETE FROM passwords");
    // await conDB.promise().query("DELETE FROM notes");
    // // await conDB.promise().query("DELETE FROM saved_daily_segments");
    // await conDB.promise().query("DELETE FROM daily_segments");
    // await conDB.promise().query("DELETE FROM minyans");
    // await conDB.promise().query("DELETE FROM users")
    // // Reset AUTO_INCREMENT for users table
    // await conDB.promise().query("ALTER TABLE users AUTO_INCREMENT = 1");



const insertUsers = `
INSERT INTO users (user_id, user_name, user_userName, email, phone) VALUES
(1, 'Leanne Graham', 'Bret', 'Sincere@april.biz', '0556723732'),
(2, 'Ervin Howell', 'Antonette', 'Shanna@melissa.tv', '0526723732'),
(3, 'Clementine Bauch', 'Samantha', 'Nathan@yesenia.net', '0550023732'),
(4, 'Patricia Lebsack', 'Karianne', 'Julianne.OConner@kory.org', '0556723799'),
(5, 'Chelsey Dietrich', 'Kamren', 'Lucio_Hettinger@annie.ca', '0554386546')
`;
    // await conDB.promise().query(insertUsers);
    // console.log("Initial users inserted"); 
    const insertPasswords = `
    INSERT INTO passwords (user_id,password ) VALUES
    (1, 'hildegard.org'),
    (2, 'anastasia.net'),
    (3,'Nathan@yesenia.net' ),
    (4, 'Patricia Lebsack'),
    (5, 'Chelsey Dietrich')
    `;
    // await conDB.promise().query(insertPasswords);

const insertDaily_segments = `
INSERT INTO daily_segments (segment_date, segment_pdf_url, start_page, end_page) VALUES
('2025-05-28', '/Prayers_And_Segments_Files/Aavti.pdf', 6, 7),
('2025-05-29', '/Prayers_And_Segments_Files/Aavti.pdf', 7, 8),
('2025-05-30', '/Prayers_And_Segments_Files/Aavti.pdf', 8, 9),
('2025-05-31', '/Prayers_And_Segments_Files/Aavti.pdf', 9, 10),
('2025-06-01', '/Prayers_And_Segments_Files/Aavti.pdf', 10, 11),
('2025-06-02', '/Prayers_And_Segments_Files/Aavti.pdf', 11, 12),
('2025-06-03', '/Prayers_And_Segments_Files/Aavti.pdf', 12, 13),
('2025-06-04', '/Prayers_And_Segments_Files/Aavti.pdf', 13, 14),
('2025-06-05', '/Prayers_And_Segments_Files/Aavti.pdf', 14, 15),
('2025-06-06', '/Prayers_And_Segments_Files/Aavti.pdf', 15, 16),
('2025-06-07', '/Prayers_And_Segments_Files/Aavti.pdf', 16, 17),
('2025-06-08', '/Prayers_And_Segments_Files/Aavti.pdf', 17, 18),
('2025-06-09', '/Prayers_And_Segments_Files/Aavti.pdf', 18, 19),
('2025-06-10', '/Prayers_And_Segments_Files/Aavti.pdf', 19, 20),
('2025-06-11', '/Prayers_And_Segments_Files/Aavti.pdf', 20, 21),
('2025-06-12', '/Prayers_And_Segments_Files/Aavti.pdf', 21, 22),
('2025-06-13', '/Prayers_And_Segments_Files/Aavti.pdf', 22, 23),
('2025-06-14', '/Prayers_And_Segments_Files/Aavti.pdf', 23, 24),
('2025-06-15', '/Prayers_And_Segments_Files/Aavti.pdf', 24, 25),
('2025-06-16', '/Prayers_And_Segments_Files/Aavti.pdf', 25, 26),
('2025-06-17', '/Prayers_And_Segments_Files/Aavti.pdf', 26, 27),
('2025-06-18', '/Prayers_And_Segments_Files/Aavti.pdf', 27, 28),
('2025-06-19', '/Prayers_And_Segments_Files/Aavti.pdf', 28, 29),
('2025-06-20', '/Prayers_And_Segments_Files/Aavti.pdf', 29, 30),
('2025-06-21', '/Prayers_And_Segments_Files/Aavti.pdf', 30, 31),
('2025-06-22', '/Prayers_And_Segments_Files/Aavti.pdf', 31, 32),
('2025-06-23', '/Prayers_And_Segments_Files/Aavti.pdf', 32, 33),
('2025-06-24', '/Prayers_And_Segments_Files/Aavti.pdf', 33, 34),
('2025-06-25', '/Prayers_And_Segments_Files/Aavti.pdf', 34, 35),
('2025-06-26', '/Prayers_And_Segments_Files/Aavti.pdf', 35, 36),
('2025-06-27', '/Prayers_And_Segments_Files/Aavti.pdf', 36, 37),
('2025-06-28', '/Prayers_And_Segments_Files/Aavti.pdf', 37, 38),
 ('2025-06-29', '/Prayers_And_Segments_Files/Aavti.pdf', 38, 39)
 `;
await conDB.promise().query(insertDaily_segments);

    const insertMinyans= `
    INSERT INTO minyans  (minyan_id,time_and_date  ,longitude,latitude,opener_phone, is_daily) VALUES
   
    `;

    


 const insertPrayers= `
    INSERT INTO prayers  (prayer_name,prayers_pdf_url,start_page,end_page) VALUES
    ('Shacharit', '/Prayers_Files/Sidur.pdf', 11, 187),
    ('Mincha', '/Prayers_Files/Sidur.pdf', 187, 224),
    ('Maariv', '/Prayers_Files/Sidur.pdf', 224, 262)
    `;
    // await conDB.promise().query(insertPrayers);
  
}

  initializeDB();
  module.exports = initializeDB;



//   function getTodayDate() {
//   const today = new Date();
//   const yyyy = today.getFullYear();
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const dd = String(today.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// const today = getTodayDate();
// // לדוגמה:
// const insertDaily_segments = `
// INSERT INTO daily_segments (segment_date, segment_pdf_url, start_page, end_page) VALUES
// ('${today}', '/Prayers_Files/sidur.pdf', 1, 10)
// `;