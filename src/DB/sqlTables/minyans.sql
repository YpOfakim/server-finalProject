CREATE TABLE minyans (
    minyan_id INT AUTO_INCREMENT NOT NULL,
    time_and_date DATETIME NOT NULL ,
    longitude Double NOT NULL ,
    latitude Double NOT NULL,
    opener_phone VARCHAR(10) NOT NULL,
    is_daily BOOLEAN NOT NULL,
    address VARCHAR(50), 
    UNIQUE(longitude,latitude,time_and_date),
    PRIMARY KEY(minyan_id,time_and_date,longitude,latitude)
);