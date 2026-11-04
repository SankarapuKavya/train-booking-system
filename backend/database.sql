CREATE DATABASE IF NOT EXISTS train_booking
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE train_booking;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS journey_seats;
DROP TABLE IF EXISTS train_stops;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS stations;

CREATE TABLE stations (
  station_id INT AUTO_INCREMENT PRIMARY KEY,
  station_code VARCHAR(10) NOT NULL UNIQUE,
  station_name VARCHAR(120) NOT NULL,
  city VARCHAR(80) NOT NULL,
  state_name VARCHAR(80) NOT NULL
);

CREATE TABLE trains (
  train_id INT AUTO_INCREMENT PRIMARY KEY,
  train_number VARCHAR(10) NOT NULL UNIQUE,
  train_name VARCHAR(120) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration_text VARCHAR(30) NOT NULL
);

CREATE TABLE train_stops (
  train_id INT NOT NULL,
  station_id INT NOT NULL,
  stop_order INT NOT NULL,
  arrival_time TIME NULL,
  departure_time TIME NULL,
  PRIMARY KEY (train_id, station_id),
  UNIQUE KEY unique_train_stop_order (train_id, stop_order),
  FOREIGN KEY (train_id) REFERENCES trains(train_id),
  FOREIGN KEY (station_id) REFERENCES stations(station_id)
);

CREATE TABLE journey_seats (
  journey_seat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  journey_date DATE NOT NULL,
  travel_class ENUM('Sleeper','3A','2A','1A') NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  status ENUM('Available','Booked') NOT NULL DEFAULT 'Available',
  UNIQUE KEY unique_seat_per_journey
    (train_id, journey_date, travel_class, seat_number),
  FOREIGN KEY (train_id) REFERENCES trains(train_id)
);

CREATE TABLE bookings (
  booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  passenger_name VARCHAR(100) NOT NULL,
  passenger_age INT NOT NULL,
  passenger_email VARCHAR(150) NOT NULL,
  train_id INT NOT NULL,
  journey_seat_id BIGINT NOT NULL,
  journey_date DATE NOT NULL,
  travel_class ENUM('Sleeper','3A','2A','1A') NOT NULL,
  booking_status ENUM('Confirmed','Cancelled') NOT NULL DEFAULT 'Confirmed',
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (train_id) REFERENCES trains(train_id),
  FOREIGN KEY (journey_seat_id) REFERENCES journey_seats(journey_seat_id)
);

INSERT INTO stations (station_code, station_name, city, state_name) VALUES
('CSMT','Chhatrapati Shivaji Maharaj Terminus','Mumbai','Maharashtra'),
('MMCT','Mumbai Central','Mumbai','Maharashtra'),
('NDLS','New Delhi','Delhi','Delhi'),
('DLI','Old Delhi','Delhi','Delhi'),
('SBC','KSR Bengaluru City Junction','Bengaluru','Karnataka'),
('YPR','Yesvantpur Junction','Bengaluru','Karnataka'),
('MAS','MGR Chennai Central','Chennai','Tamil Nadu'),
('SC','Secunderabad Junction','Hyderabad','Telangana'),
('HWH','Howrah Junction','Kolkata','West Bengal'),
('PUNE','Pune Junction','Pune','Maharashtra'),
('JP','Jaipur Junction','Jaipur','Rajasthan'),
('ADI','Ahmedabad Junction','Ahmedabad','Gujarat'),
('ERS','Ernakulam Junction','Kochi','Kerala'),
('BPL','Bhopal Junction','Bhopal','Madhya Pradesh'),
('AGC','Agra Cantt','Agra','Uttar Pradesh'),
('LKO','Lucknow Charbagh','Lucknow','Uttar Pradesh'),
('VSKP','Visakhapatnam','Visakhapatnam','Andhra Pradesh'),
('BBS','Bhubaneswar','Bhubaneswar','Odisha'),
('NGP','Nagpur Junction','Nagpur','Maharashtra'),
('SUR','Solapur','Solapur','Maharashtra');

INSERT INTO trains (train_number, train_name, departure_time, arrival_time, duration_text) VALUES
('12951','Mumbai Rajdhani Express','16:35:00','08:35:00','16h 00m'),
('12137','Punjab Mail','19:35:00','07:35:00','12h 00m'),
('12627','Karnataka Express','19:20:00','10:30:00','15h 10m'),
('12723','Telangana Express','06:25:00','07:40:00','25h 15m'),
('12839','Howrah Mail','20:35:00','05:00:00','32h 25m'),
('12263','Duronto Express','20:15:00','06:10:00','9h 55m'),
('12957','Swarn Jayanti Express','19:55:00','07:10:00','11h 15m'),
('12678','Kochuveli Express','18:00:00','07:00:00','13h 00m'),
('12864','YPR Howrah Express','10:30:00','16:00:00','29h 30m'),
('22691','Rajdhani Express','20:00:00','06:00:00','10h 00m'),
('19019','Dehradun Express','00:20:00','06:00:00','5h 40m'),
('11014','Coimbatore Express','16:00:00','08:00:00','16h 00m');

-- Stop order is used to ensure the destination occurs after the source.
INSERT INTO train_stops (train_id, station_id, stop_order) VALUES
(1,1,1),(1,9,2),(1,14,3),(1,15,4),(1,3,5),
(2,1,1),(2,10,2),(2,20,3),(2,14,4),(2,3,5),
(3,5,1),(3,14,2),(3,15,3),(3,3,4),
(4,5,1),(4,8,2),(4,14,3),(4,3,4),
(5,5,1),(5,18,2),(5,9,3),
(6,1,1),(6,10,2),(6,20,3),(6,5,4),
(7,1,1),(7,12,2),(7,3,3),
(8,13,1),(8,5,2),(8,7,3),
(9,6,1),(9,18,2),(9,9,3),
(10,7,1),(10,8,2),(10,5,3),
(11,1,1),(11,10,2),(11,14,3),(11,11,4),(11,3,5),
(12,1,1),(12,10,2),(12,20,3),(12,5,4);
