const express = require('express');
const router = express.Router();
const humiditiesController = require('../../controllers/HumidityController');

// GET all humidities
router.get('/', async (req, res) => {
    try {
        const humidities = await humiditiesController.getAllHumidities();
        res.json(humidities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting humidity data', details: error.message });
    }
});

// Humidity POST
router.post('/save_hum', async (req, res) => {
    const pilonId = req.body.pilonId;
    const humidity = req.body.humidity;

    try {
        await humiditiesController.saveHumidity(pilonId, humidity);

        res.json({ message: 'Humidity saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving humidity', details: error.message });
    }
});

module.exports = router;
