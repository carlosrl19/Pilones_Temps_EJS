const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const pilonesController = {
    // Pilon's *
    getAllPilones: async () => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM pilones'); // Execute request

            connection.end(); // Cierra la conexión

            return results;
        } catch (error) {
            throw new Error('Error al obtener los registros de pilones: ' + error.message);
        }
    },

    // Pilon's WHERE id
    getPilonById: async (pilonesId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM pilones WHERE id = ?', [pilonesId]); // Execute request

            connection.end(); // Cierra la conexión

            if (results.length === 0) {
                throw new Error('Pilon not found');
            }
            return results[0];
        } catch (error) {
            throw new Error('Error fetching pilon: ' + error.message);
        }
    },

    // Pilon's create
    createPilon: async (nombre, variedad, finca, etapa, pn, temp_min, temp_max, estado) => {
        try {
            const connection = await mysql.createConnection(dbConfig);

            const insertQuery = `
            INSERT INTO pilones (nombre, variedad, finca, etapa, pn, temp_min, temp_max, fecha_ingreso, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`;

            await connection.execute(insertQuery, [nombre, variedad, finca, etapa, pn, temp_min, temp_max, estado]);

            connection.end();
        } catch (error) {
            throw new Error('Error creating pilón: ' + error.message);
        }
    },

    // Pilon's update
    updatePilones: async (pilonId, nombre, variedad, finca, etapa, pn, temp_min, temp_max, estado) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const updateQuery = `
                UPDATE pilones
                SET nombre = ?,
                    variedad = ?,
                    finca = ?,
                    etapa = ?,
                    pn = ?,
                    temp_min = ?,
                    temp_max = ?,
                    estado = ?
                WHERE id = ?`;

            await connection.execute(updateQuery, [nombre, variedad, finca, etapa, pn, temp_min, temp_max, estado, pilonId]);
            connection.end(); // Cierra la conexión

            // Add pilones update logic in pilones table if this is neccesary
        } catch (error) {
            throw new Error('Error updating pilon: ' + error.message);
        }
    },

    // Pilon's delete
    deletePilones: async (pilonesId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const deleteQuery = 'DELETE FROM pilones WHERE id = ?'; // Execute request
            const [result] = await connection.execute(deleteQuery, [pilonesId]);

            connection.end(); // Cierra la conexión

            return result.affectedRows; // Devuelve la cantidad de filas eliminadas
        } catch (error) {
            throw new Error('Error deleting pilon: ' + error.message);
        }
    },

    // More functions
};

module.exports = pilonesController;