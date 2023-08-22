const express = require('express');
const router = express.Router();
const arduinosController = require('./../../controllers/ArduinoController');
const db = require('../../public/config/database');

// Arduino's *
router.get('/', async (req, res) => {
    try {
        const arduinos = await arduinosController.getAllArduinos();
        res.json(arduinos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros de arduinos' });
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

module.exports = router;