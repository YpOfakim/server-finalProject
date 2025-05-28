CREATE TABLE users (
    user_id INT AUTO_INCREMENT ,
    user_name VARCHAR(20) NOT NULL CHECK (LENGTH(user_name) BETWEEN 3 AND 20),
    user_userName VARCHAR(20) NOT NULL CHECK (LENGTH(user_userName) BETWEEN 3 AND 20),
    email VARCHAR(50) NOT NULL CHECK (LENGTH(email) BETWEEN 5 AND 50),
 phone VARCHAR(10) NOT NULL CHECK (LENGTH(phone)=10 ),
 UNIQUE(user_name),
PRIMARY KEY(user_id)
);

