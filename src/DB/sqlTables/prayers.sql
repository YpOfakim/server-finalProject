
CREATE TABLE prayers (
    prayer_id INT AUTO_INCREMENT PRIMARY KEY,
    prayer_name VARCHAR(50) NOT NULL,
    prayers_pdf_url VARCHAR(255) NOT NULL,
    start_page INT NOT NULL,
    end_page INT NOT NULL
);
