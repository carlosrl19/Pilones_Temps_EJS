CREATE DATABASE Arduino;

use Arduino;

-- Crear la tabla pilones
CREATE TABLE pilones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE,
    variedad VARCHAR(255),
    finca VARCHAR(255),
    etapa INT,
    pn decimal(8,3) NOT NULL,
    temp_min INT,
    temp_max INT,
    fecha_ingreso DATE,
    estado VARCHAR(12),
    asignado VARCHAR(12)
);

-- Crear la tabla temperaturas
CREATE TABLE temperaturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilon_encargado INT,
    fecha_lectura DATE,
    hora_lectura TIME,
    unidad VARCHAR(10),
    lectura FLOAT,
    modo_lectura VARCHAR(12),
    FOREIGN KEY (pilon_encargado) REFERENCES pilones(id) ON DELETE CASCADE
);

-- Crear la tabla humedadf
CREATE TABLE humedad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilon_encargado INT,
    fecha_lectura DATE,
    hora_lectura TIME,
    lectura FLOAT,
    FOREIGN KEY (pilon_encargado) REFERENCES pilones(id)
);

-- Crear la tabla arduinos
CREATE TABLE arduinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) unique,
    direccion_bits VARCHAR(16) UNIQUE,
    pilon_encargado INT UNIQUE,
    arduino_port VARCHAR(12),
    FOREIGN KEY (pilon_encargado) REFERENCES pilones(id)
);

SELECT * from pilones;

INSERT INTO arduinos (nombre, direccion_bits, pilon_encargado, arduino_port) VALUES ('Arduino 04', '28BEFD79970003CF', '108', '/dev/ttyACM0');

INSERT INTO pilones (nombre, variedad, finca, etapa, pn, temp_min, temp_max, fecha_ingreso, estado, asignado)
VALUES
    ('Pilón 03', 'Variedad 2', 'DEF', 2, 6000, 55, 85, CURDATE(), 'En proceso', ''),
    ('Pilón 04', 'Variedad 3', 'GHI', 3, 7000, 60, 90, CURDATE(), 'En proceso', ''),
    ('Pilón 05', 'Variedad 4', 'JKL', 4, 8000, 65, 95, CURDATE(), 'En proceso', ''),
    ('Pilón 06', 'Variedad 5', 'MNO', 5, 9000, 70, 100, CURDATE(), 'En proceso', ''),
    ('Pilón 07', 'Variedad 6', 'PQR', 6, 10000, 75, 105, CURDATE(), 'En proceso', ''),
    ('Pilón 08', 'Variedad 7', 'STU', 7, 11000, 80, 110, CURDATE(), 'En proceso', ''),
    ('Pilón 09', 'Variedad 8', 'VWX', 8, 12000, 85, 115, CURDATE(), 'En proceso', ''),
    ('Pilón 10', 'Variedad 9', 'YZA', 9, 13000, 90, 120, CURDATE(), 'En proceso', '')