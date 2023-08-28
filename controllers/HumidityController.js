const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const humiditiesController = {
    getAllHumidities: async () => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [results] = await connection.execute(`
                SELECT pilones.nombre, humedad.fecha_lectura, humedad.hora_lectura, humedad.lectura
                FROM humedad
                JOIN pilones ON pilones.id = humedad.pilon_encargado
                ORDER BY humedad.fecha_lectura, humedad.hora_lectura
            `);
            connection.end();
            return results;
        } catch (error) {
            throw new Error('Error getting humidity data: ' + error.message);
        }
    },

    saveHumidity: async (humidity, pilonId) => {
        try {
            const connection = await mysql.createConnection(dbConfig);

            const insertHumidityQuery = 'INSERT INTO humedad (pilon_encargado, fecha_lectura, hora_lectura, lectura) VALUES (?, CURDATE(), CURTIME(), ?)';
            const humidityValues = [pilonId, humidity];

            const [results] = await connection.execute(insertHumidityQuery, humidityValues);

            connection.end();
            console.log('Humidity saved to the database');
            return results;
        } catch (error) {
            console.error('Error saving humidity data:', error);
            throw new Error('Error saving humidity data');
        }
    },

    // Add other functions as needed
};

module.exports = humiditiesController;