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

// Add other API endpoints as needed

module.exports = router;
