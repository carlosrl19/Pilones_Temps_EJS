CREATE DATABASE pilones_temps;

use pilones_temps;

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
    FOREIGN KEY (pilon_encargado) REFERENCES pilones(id) ON DELETE CASCADE
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

INSERT INTO arduinos (nombre, direccion_bits, pilon_encargado, arduino_port)
VALUES
    ('Arduino 03', '28BEFD79970003AA', 1, '/dev/ttyACM0'),
    ('Arduino 04', '28BEFD79970004CA', 2, '/dev/ttyACM0'),
    ('Arduino 05', '28BEFD79970005CA', 3, '/dev/ttyACM0'),
    ('Arduino 06', '28BEFD79970006CA', 4, '/dev/ttyACM0'),
    ('Arduino 07', '28BEFD79970007CA', 5, '/dev/ttyACM0'),
    ('Arduino 08', '28BEFD79970008CA', 6, '/dev/ttyACM0'),
    ('Arduino 09', '28BEFD79970009CA', 7, '/dev/ttyACM0'),
    ('Arduino 10', '28BEFD79970010CA', 8, '/dev/ttyACM0');