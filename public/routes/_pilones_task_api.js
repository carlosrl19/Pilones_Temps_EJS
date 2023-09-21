const express = require('express');
const router = express.Router();
const pilonesTaskController = require('../../controllers/PilonesTaskController');
const db = require('../config/database');

// Pilon's *
router.get('/', async (req, res) => {
    try {
        const pilonTask = await pilonesTaskController.getAllTasks();
        res.json(pilonTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error in obtaining pilón records' });
    }
});

// Pilon's WHERE ID
router.get('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await pilonesTaskController.getPilonTaskById(taskId);
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching pilón tasks', details: error.message });
    }
});

// Pilon task CREATE
router.post('/', async (req, res) => {
    try {
        const { task, person_in_charge, pilon_selected, task_start_date, task_start_temp, task_end_date, start_time, end_time } = req.body;

        await pilonesTaskController.createPilonTask(task, person_in_charge, pilon_selected, task_start_date, task_start_temp, task_end_date, start_time, end_time);
        res.status(201).json({ message: 'Task created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating task', details: error.message });
    }
});

// Pilon task UPDATE
router.put('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { task, person_in_charge, pilon_selected, task_start_date, task_end_date, start_time, end_time} = req.body;

        await pilonesTaskController.updatePilonTask(taskId, task, person_in_charge, pilon_selected, task_start_date, task_end_date, start_time, end_time);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating pilón task', details: error.message});
    }
});

module.exports = router;