const express = require('express');
const router = express.Router();
const workerController = require('../../controllers/WorkerController');
const db = require('../config/database');

// Workers *
router.get('/', async (req, res) => {
    try {
        const arduinos = await workerController.getAllWorkers();
        res.json(arduinos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining worker registers' });
    }
});

// Workers WHERE ID
router.get('/:workerId', async (req, res) => {
    try {
        const workerId = req.params.workerId;
        const encargado = await workerController.getWorkerById(workerId);
        res.json(encargado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching worker', details: error.message });
    }
});

// Workers CREATE
router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body;
        const newWorkerId = await workerController.createWorker(nombre);

        res.status(201).json({ message: 'Worker created', insertedId: newWorkerId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating worker', details: error.message });
    }
});

// Workers UPDATE
router.put('/:workerId', async (req, res) => {
    try {
        const workerId = req.params.workerId;
        const { nombre} = req.body;

        await workerController.updateWorker(workerId, nombre);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating worker', details: error.message});
    }
});

// Worker DELETE
router.delete('/:workerId', async (req, res) => {
    try {
        const workerId = req.params.workerId;
        const result = await workerController.deleteWorker(workerId);
        res.json({ message: 'Worker deleted', rowsAffected: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting Arduino', details: error.message });
    }
});

module.exports = router;