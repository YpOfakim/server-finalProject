CREATE TABLE daily_segments (
    daily_segments_id INT AUTO_INCREMENT NOT NULL,
    segment_date DATE NOT NULL,
    url_link VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL,
    PRIMARY KEY(daily_segments_id)
);