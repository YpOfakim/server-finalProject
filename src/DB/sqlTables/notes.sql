-- DROP TABLE IF EXISTS notes
CREATE TABLE notes (
    note_id INT AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    body VARCHAR(2000) NOT NULL,
    note_date DATE NOT NULL,
    note_title VARCHAR(255) NOT NULL,
    PRIMARY KEY (note_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);