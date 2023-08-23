const express = require('express');
const router = express.Router();
const temperaturesController = require('../../controllers/GraphicController');

// GET temperatures filtered by pilonId
router.get('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const fechaInicial = req.query.fechaInicial;
        const fechaFinal = req.query.fechaFinal;

        const temperatures = await temperaturesController.getTemperaturesByPilonId(pilonId, fechaInicial, fechaFinal);
        res.json(temperatures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting filtered temperature data', details: error.message });
    }
});

// Add other API endpoints as needed

module.exports = router;
