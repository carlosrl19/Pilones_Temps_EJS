const express = require('express');
const router = express.Router();
const pilonesController = require('./../../controllers/PilonesController');
const db = require('../../public/config/database');

// Pilon's *
router.get('/', async (req, res) => {
    try {
        const pilones = await pilonesController.getAllPilones();
        res.json(pilones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error in obtaining pylon records' });
    }
});

// Pilon's WHERE ID
router.get('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const pilon = await pilonesController.getPilonById(pilonId);
        res.json(pilon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Pilon', details: error.message });
    }
});

// Pilon's UPDATE
router.put('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const { nombre, variedad, finca, etapa, pn, temp_min, temp_max, fecha_ingreso, estado, asignado } = req.body;

        await pilonesController.updatePilones(pilonId, nombre, variedad, finca, etapa, pn, temp_min, temp_max, fecha_ingreso, estado, asignado);
        res.sendStatus(200); // Envía una respuesta exitosa al cliente
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Pilon', details: error.message });
    }
});

// Pilon's DELETE
router.delete('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const result = await pilonesController.deletePilones(pilonId);
        res.json({ message: 'Pilon deleted', rowsAffected: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting Pilon', details: error.message });
    }
});

module.exports = router;