CREATE TABLE notes (
    note_id INT NOT NULL,
    user_id INT NOT NULL,
    body VARCHAR(255) NOT NULL,
    PRIMARY KEY (note_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);