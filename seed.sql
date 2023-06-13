CREATE DATABASE carshop;

\c carshop;

CREATE TABLE cars(
   id SERIAL PRIMARY KEY,
   make VARCHAR(50),
   model VARCHAR(50),
   year INT
);

INSERT INTO cars(make, model, year) 
VALUES ('Tesla', 'Model 3', 2021), 
('Toyota', 'Corolla', 2020), 
('Ford', 'F-150', 2021);
