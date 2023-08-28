const express = require('express');
const router = express.Router();
const temperaturesController = require('../../controllers/TemperatureController');

// GET all temperatures
router.get('/', async (req, res) => {
    try {
        const temperatures = await temperaturesController.getAllTemperatures();
        res.json(temperatures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting temperature data', details: error.message });
    }
});

// GET temperatures filtered by pilonId and optional date range
router.get('/:pilonId', async (req, res) => {
    const pilonId = req.params.pilonId;
    const fechaInicial = req.query.fechaInicial;
    const fechaFinal = req.query.fechaFinal;

    try {
        const temperatures = await temperaturesController.getTemperaturesByPilonId(pilonId, fechaInicial, fechaFinal);
        res.json(temperatures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting filtered temperature data', details: error.message });
    }
});

// Temperature POST
router.post('/save_temp', async (req, res) => {
    const pilonId = req.body.pilonId;
    const temperature = req.body.temperature;

    try {
        await temperaturesController.saveTemperature(pilonId, temperature);

        res.json({ message: 'Temperature saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving temperature', details: error.message });
    }
});

module.exports = router;
