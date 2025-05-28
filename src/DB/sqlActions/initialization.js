
var path = require("path");
const conDB = require("../dataBase/connectToDB");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

    // הכנסת נתונים התחלתיים לטבלת users
    async function initializeDB() {
        // הכנסת נתונים התחלתיים לטבלת users
    //     const insertUsers = `
    //     INSERT INTO users (user_id, user_name,user_userName, email) VALUES
    //     (1, 'Leanne Graham','Bret', 'Sincere@april.biz'),
    //     (2, 'Ervin Howell',"Antonette", 'Shanna@melissa.tv'),
    //     (3, 'Clementine Bauch', "Samantha",'Nathan@yesenia.net'),
    //     (4, 'Patricia Lebsack',"Karianne", 'Julianne.OConner@kory.org'),
    //     (5, 'Chelsey Dietrich',"Kamren", 'Lucio_Hettinger@annie.ca')
    //     `;
 
    // await conDB.promise().query(insertUsers);
    // console.log("Initial users inserted"); 
    // const insertPasswords = `
    // INSERT INTO passwords (user_id,password ) VALUES
    // (1, 'hildegard.org'),
    // (2, 'anastasia.net'),
    // (3,'Nathan@yesenia.net' ),
    // (4, 'Patricia Lebsack'),
    // (5, 'Chelsey Dietrich')
    // `;
    // await conDB.promise().query(insertPasswords);

    const insertTodos = `
    INSERT INTO todos  (todo_id,user_id,title, completed) VALUES
    (1,3,  "sit ",0),
    (2,3,  "uhfjt",1)

    `;
    await conDB.promise().query(insertTodos);
    // const insertPosts = `
    // INSERT INTO posts  (post_id,user_id, body) VALUES
    // (1,  1,"et iusto sed quo iure\nvoluptatem ")
 

    // `;
    // await conDB.promise().query(insertPosts);
    // const insertComments = `
    // INSERT INTO comments  (comment_id,post_id, comment_name,email,body) VALUES
    // (1,  1, "id labore ex et ","Eliseo@gardner.biz",
    // "laudantium enim quasi est quidem magnam voluptate ")
    // `;
    // await conDB.promise().query(insertComments);


  }
  
  initializeDB();
  module.exports = initializeDB;