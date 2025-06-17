CREATE TABLE daily_segments (
    daily_segments_id INT AUTO_INCREMENT NOT NULL,
    segment_date DATE NOT NULL,
    segment_pdf_url VARCHAR(255) NOT NULL,
    start_page INT NOT NULL,
    end_page INT NOT NULL,
    PRIMARY KEY(daily_segments_id)
);
