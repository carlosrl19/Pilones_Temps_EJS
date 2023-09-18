const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const workerController = {
    // Worker *
    getAllWorkers: async () => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM trabajadores'); // Execute request

            connection.end(); // Cierra la conexión

            return results;
        } catch (error) {
            throw new Error('Error obtaining workers registers: ' + error.message);
        }
    },

    // Worker WHERE id
    getWorkerById: async (workersId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM trabajadores WHERE id = ?', [workersId]); // Execute request

            connection.end(); // Cierra la conexión

            if (results.length === 0) {
                throw new Error('Worker not found');
            }
            return results[0];
        } catch (error) {
            throw new Error('Error fetching worker: ' + error.message);
        }
    },

    // Worker CREATE
    createWorker: async (nombre) => {
        try {
            const connection = await mysql.createConnection(dbConfig);

            const insertQuery = `
            INSERT INTO trabajadores (nombre)
            VALUES (?)`;

            await connection.execute(insertQuery, [nombre]);

            connection.end();
        } catch (error) {
            throw new Error('Error creating new worker: ' + error.message);
        }
    },

    // Workers UPDATE
    updateWorker: async (workerId, nombre) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const updateQuery = 'UPDATE trabajadores SET nombre = ? WHERE id = ?';
            await connection.execute(updateQuery, [nombre, workerId]);

            connection.end();

        } catch (error) {
            throw new Error('Error updating worker: ' + error.message);
        }
    },

    // Worker DELETE
    deleteWorker: async (workerId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const deleteQuery = 'DELETE FROM trabajadores WHERE id = ?'; // Execute request
            const [result] = await connection.execute(deleteQuery, [workerId]);

            connection.end(); // Cierra la conexión

            return result.affectedRows; // Devuelve la cantidad de filas eliminadas
        } catch (error) {
            throw new Error('Error deleting worker: ' + error.message);
        }
    },

    // More functions

};

module.exports = workerController;