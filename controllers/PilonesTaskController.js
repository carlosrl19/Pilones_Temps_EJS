const mysql = require('mysql2/promise');
const dbConfig = require('../public/config/database');

const pilonesTaskController = {

    // Tasks *
    getAllTasks: async () => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM pilones_virado_mojado'); // Execute request

            connection.end(); // Cierra la conexión

            return results;
        } catch (error) {
            throw new Error('Error al obtener los registros de pilones: ' + error.message);
        }
    },

    // Tasks WHERE id
    getPilonTaskById: async (tasksId) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const [results] = await connection.execute('SELECT * FROM pilones_virado_mojado WHERE id = ?', [tasksId]); // Execute request

            connection.end(); // Cierra la conexión

            if (results.length === 0) {
                throw new Error('Pilon task not found');
            }
            return results[0];
        } catch (error) {
            throw new Error('Error fetching pilón task: ' + error.message);
        }
    },

    // Pilon task CREATE
    createPilonTask: async (task, person_in_charge, pilon_selected, task_start_date, task_start_temp, task_end_date, start_time, end_time) => {
        try {
            const connection = await mysql.createConnection(dbConfig);

            const insertQuery = `
                INSERT INTO pilones_virado_mojado (task, person_in_charge, pilon_selected, task_start_date, task_start_temp, task_end_date, start_time, end_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            await connection.execute(insertQuery, [task, person_in_charge, pilon_selected, task_start_date, task_start_temp, task_end_date, start_time, end_time]);

            connection.end();
        } catch (error) {
            throw new Error('Error creating task: ' + error.message);
        }
    },

    // Pilon task UPDATE
    updatePilonTask: async (taskId, task, person_in_charge, pilon_selected, task_start_date, task_end_date, start_time, end_time) => {
        try {
            const connection = await mysql.createConnection(dbConfig); // DB connection

            const updateQuery = 'UPDATE pilones_virado_mojado SET task = ?, person_in_charge = ?, pilon_selected = ?, task_start_date = ?, task_end_date = ?, start_time = ?, end_time = ? WHERE id = ?';
            await connection.execute(updateQuery, [task, person_in_charge, pilon_selected, task_start_date, task_end_date, start_time, end_time, taskId]);

            connection.end();

        } catch (error) {
            throw new Error(error.message);
        }
    },

    // More functions
};

module.exports = pilonesTaskController;