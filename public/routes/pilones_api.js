const express = require('express');
const router = express.Router();
const pilonesController = require('./../../controllers/PilonesController');
const db = require('../../public/config/database');

// Pilon's *
router.get('/', async (req, res) => {
    try {
        const pilones = await arduinosController.getAllPilones();
        res.json(pilones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros de pilones' });
    }
});

// Pilon's WHERE ID
router.get('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const pilon = await pilonesController.getArduinoById(pilonId);
        res.json(pilon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Pilon', details: error.message });
    }    
});

module.exports = router;