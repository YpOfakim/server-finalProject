CREATE TABLE passwords (
    user_id INT AUTO_INCREMENT ,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);