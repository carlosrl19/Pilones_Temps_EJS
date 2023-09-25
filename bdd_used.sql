/*
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS pilones_temps;

-- Usar la base de datos
USE pilones_temps;

-- Crear la tabla arduinos
CREATE TABLE arduinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    arduino_name VARCHAR(255) UNIQUE,
    bits_direction VARCHAR(16) UNIQUE,
    pilon_in_charge INT UNIQUE,
    pc_port VARCHAR(12) UNIQUE
);

-- Crear la tabla pilones
CREATE TABLE pilones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilon_name VARCHAR(255) UNIQUE,
    tobacco_variety VARCHAR(255),
    tobacco_farm VARCHAR(255),
    tobacco_stage INT,
    net_weight DECIMAL(8,3) NOT NULL,
    temp_min INT,
    temp_max INT,
    entry_date DATE,
    pilon_state VARCHAR(12),
    tobacco_cutting INT,
    tobacco_harvest VARCHAR(9),
    tobacco_class VARCHAR (255),
    tobacco_type VARCHAR(255),
    arduino_in_charge INT,
    FOREIGN KEY (arduino_in_charge) REFERENCES arduinos(id)
);

-- Crear la tabla temperaturas
CREATE TABLE temperatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilon_in_charge INT,
    reading_date DATE,
    reading_hour TIME,
    temp_unit VARCHAR(10),
    temp_lecture FLOAT,
    FOREIGN KEY (pilon_in_charge) REFERENCES pilones(id) ON DELETE CASCADE
);

-- Crear la tabla humedad
CREATE TABLE humidity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pilon_in_charge INT,
    reading_date DATE,
    reading_hour TIME,
    hum_lecture FLOAT,
    FOREIGN KEY (pilon_in_charge) REFERENCES pilones(id) ON DELETE CASCADE
);

CREATE TABLE pilones_turning_wetting (
    id INT AUTO_INCREMENT PRIMARY KEY,
	task VARCHAR(255),
    person_in_charge VARCHAR(255),
    pilon_id INT,
    task_date DATE,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (pilon_id) REFERENCES pilones(id)
);

*/

CREATE DATABASE pilones_temps;

-- Usar la base de datos
USE pilones_temps;

-- Crear la tabla arduinos
CREATE TABLE arduinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE,
    direccion_bits VARCHAR(16) UNIQUE,
    pilon_encargado INT UNIQUE,
    arduino_port VARCHAR(12) UNIQUE
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
    corte INT,
    cosecha VARCHAR(9),
    clase VARCHAR (255),
    tipo_tabaco VARCHAR(255),
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

CREATE TABLE pilones_virado_mojado (
    id INT AUTO_INCREMENT PRIMARY KEY,
	task VARCHAR(255),
    person_in_charge VARCHAR(255),
    pilon_selected VARCHAR(255),
    task_start_date DATE,
    start_time TIME,
    task_start_temp FLOAT,
    task_end_date DATE,
    end_time TIME,
	task_end_temp FLOAT
);

SELECT * FROM pilones;
SELECT * FROM pilones_virado_mojado;

CREATE TABLE trabajadores(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255)
);