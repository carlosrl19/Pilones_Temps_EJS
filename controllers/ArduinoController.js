const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const arduinosController = {
    // Arduino's *
    getAllArduinos: async () => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM arduinos'); // Execute request

            connection.end(); // Cierra la conexión

            return results;
        } catch (error) {
            throw new Error('Error al obtener los registros de arduinos: ' + error.message);
        }
    },

    // Arduino's WHERE id
    getArduinoById: async (arduinoId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM arduinos WHERE id = ?', [arduinoId]); // Execute request

            connection.end(); // Cierra la conexión

            if (results.length === 0) {
                throw new Error('Arduino not found');
            }
            return results[0];
        } catch (error) {
            throw new Error('Error fetching arduino: ' + error.message);
        }
    },

    // Arduino's update
    updateArduino: async (arduinoId, nombre, direccion_bits, pilon_encargado, arduino_port) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const updateQuery = 'UPDATE arduinos SET nombre = ?, direccion_bits = ?, pilon_encargado = ?, arduino_port = ? WHERE id = ?'; // Execute request
            await connection.execute(updateQuery, [nombre, direccion_bits, pilon_encargado, arduino_port, arduinoId]);

            connection.end(); // Cierra la conexión

            // Add arduinos update logic in pilones table if this is neccesary
        } catch (error) {
            throw new Error('Error updating arduino: ' + error.message);
        }
    },

    // Arduino's delete
    deleteArduino: async (arduinoId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const deleteQuery = 'DELETE FROM arduinos WHERE id = ?'; // Execute request
            const [result] = await connection.execute(deleteQuery, [arduinoId]);

            connection.end(); // Cierra la conexión

            return result.affectedRows; // Devuelve la cantidad de filas eliminadas
        } catch (error) {
            throw new Error('Error deleting arduino: ' + error.message);
        }
    },

    // More functions
};

module.exports = arduinosController;