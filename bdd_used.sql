-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS pilones_temps;

-- Usar la base de datos
USE pilones_temps;

-- Crear la tabla arduinos
CREATE TABLE arduinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE,
    direccion_bits VARCHAR(16) UNIQUE,
    pilon_encargado INT UNIQUE,
    arduino_port VARCHAR(12)
);

-- Crear la tabla pilones
CREATE TABLE pilones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE,
    variedad VARCHAR(255),
    finca VARCHAR(255),
    etapa INT,
    pn DECIMAL(8,3) NOT NULL,
    temp_min INT,
    temp_max INT,
    fecha_ingreso DATE,
    estado VARCHAR(12),
    arduino_asignado INT,
    FOREIGN KEY (arduino_asignado) REFERENCES arduinos(id)
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

-- Crear la tabla humedad
CREATE TABLE humedad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilon_encargado INT,
    fecha_lectura DATE,
    hora_lectura TIME,
    lectura FLOAT,
    FOREIGN KEY (pilon_encargado) REFERENCES pilones(id) ON DELETE CASCADE
);