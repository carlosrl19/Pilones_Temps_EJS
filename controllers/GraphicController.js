const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const graphicsController = {
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

module.exports = graphicsController;
