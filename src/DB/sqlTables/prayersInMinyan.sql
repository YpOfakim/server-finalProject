-- DROP TABLE IF EXISTS prayersInMinyan
CREATE TABLE prayersInMinyan (
    prayerInMinyan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    minyan_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (minyan_id) REFERENCES minyans(minyan_id) ON DELETE CASCADE
);
