const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const temperaturesController = {
    getAllTemperatures: async () => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [results] = await connection.execute(`
        SELECT pilones.nombre, temperaturas.fecha_lectura, temperaturas.hora_lectura, temperaturas.unidad, temperaturas.lectura, temperaturas.modo_lectura
        FROM temperaturas
        JOIN pilones ON pilones.id = temperaturas.pilon_encargado
        ORDER BY temperaturas.fecha_lectura, temperaturas.hora_lectura
      `);
            connection.end();
            return results;
        } catch (error) {
            throw new Error('Error getting temperature data: ' + error.message);
        }
    },

    getTemperaturesByPilonId: async (pilonId, fechaInicial, fechaFinal) => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            let query = 'SELECT * FROM temperaturas WHERE pilon_encargado = ?';
            let params = [pilonId];

            // Verify if start and end dates were provided
            if (fechaInicial && fechaFinal) {
                query += ' AND fecha_lectura BETWEEN ? AND ?';
                params.push(fechaInicial, fechaFinal);
            }

            const [results] = await connection.execute(query, params);
            connection.end();
            return results;
        } catch (error) {
            throw new Error('Error getting filtered temperature data: ' + error.message);
        }
    },

    // Add other functions as needed
};

module.exports = temperaturesController;
