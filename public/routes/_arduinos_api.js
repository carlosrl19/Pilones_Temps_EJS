const express = require('express');
const router = express.Router();
const arduinosController = require('../../controllers/ArduinoController');
const db = require('../config/database');

// Arduino's *
router.get('/', async (req, res) => {
    try {
        const arduinos = await arduinosController.getAllArduinos();
        res.json(arduinos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining arduino registers' });
    }
});

// Arduino's CREATE
router.post('/', async (req, res) => {
    try {
        const { nombre, direccion_bits, pilon_encargado, arduino_port } = req.body;

        const newArduinoId = await arduinosController.createArduino(nombre, direccion_bits, pilon_encargado, arduino_port);

        res.status(201).json({ message: 'Arduino created', insertedId: newArduinoId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Arduino', details: error.message });
    }
});

// Arduino's WHERE ID
router.get('/:arduinoId', async (req, res) => {
    try {
        const arduinoId = req.params.arduinoId;
        const arduino = await arduinosController.getArduinoById(arduinoId);
        res.json(arduino);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Arduino', details: error.message });
    }
});

// Arduino's UPDATE
router.put('/:arduinoId', async (req, res) => {
    try {
        const arduinoId = req.params.arduinoId;
        const { nombre, pilon_encargado, direccion_bits, arduino_port} = req.body;

        await arduinosController.updateArduino(arduinoId, nombre, direccion_bits, pilon_encargado, arduino_port);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating arduino', details: error.message});
    }
});

// Arduino's DELETE
router.delete('/:arduinoId', async (req, res) => {
    try {
        const arduinoId = req.params.arduinoId;
        const result = await arduinosController.deleteArduino(arduinoId);
        res.json({ message: 'Arduino deleted', rowsAffected: result });
    } catch (error) {
        console.error(error);

        // Extern keys validations
        if (error.message.includes('Cannot delete or update a parent row')) {
            return res.status(400).json({ error: 'Unable to remove the Arduino due to foreign key constraint.' });
        }

        res.status(500).json({ error: 'Error deleting Arduino', details: error.message });
    }
});

module.exports = router;