const express = require('express');
const router = express.Router();
const pilonesController = require('../../controllers/PilonesController');
const db = require('../config/database');

// Pilon's *
router.get('/', async (req, res) => {
    try {
        const pilones = await pilonesController.getAllPilones();
        res.json(pilones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error in obtaining pilón records' });
    }
});

// Pilon's WHERE ID
router.get('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const pilón = await pilonesController.getPilonById(pilonId);
        res.json(pilón);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Pilon', details: error.message });
    }    
});

// Pilon's CREATE
router.post('/', async (req, res) => {
    try {
        const { nombre, finca, variedad, corte, clase, cosecha, etapa, tipo_tabaco, pn, temp_min, temp_max, estado } = req.body;

        await pilonesController.createPilon(nombre, finca, variedad, corte, clase, cosecha, etapa, tipo_tabaco, pn, temp_min, temp_max, estado);
        res.status(201).json({ message: 'Pilon created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating Pilon', details: error.message });
    }
});

// Pilon's UPDATE
router.put('/:pilonId', async (req, res) => {
    try {
        const pilonId = req.params.pilonId;
        const { nombre, finca, variedad, corte, clase, cosecha, etapa, tipo_tabaco, pn, temp_min, temp_max, estado } = req.body;

        await pilonesController.updatePilones(pilonId, nombre, finca, variedad, corte, clase, cosecha, etapa, tipo_tabaco, pn, temp_min, temp_max, estado);
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