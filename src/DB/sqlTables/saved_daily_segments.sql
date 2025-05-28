CREATE TABLE saved_daily_segments (
    user_id INT NOT NULL,
    daily_segments_id INT NOT NULL,
    PRIMARY KEY (user_id ,daily_segments_id),
        FOREIGN KEY (daily_segments_id) REFERENCES daily_segments(daily_segments_id) ON DELETE CASCADE,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

);