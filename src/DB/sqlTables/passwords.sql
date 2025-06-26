DROP TABLE IF EXISTS passwords
CREATE TABLE passwords (
    user_id INT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);