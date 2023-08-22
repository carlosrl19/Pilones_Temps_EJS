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

// Arduino's UPDATE
router.put('/:arduinoId', async (req, res) => {
    try {
        const arduinoId = req.params.arduinoId;
        const { nombre, pilon_encargado, direccion_bits, arduino_port } = req.body;

        const updateQuery = 'UPDATE arduinos SET nombre = ?, direccion_bits = ?, pilon_encargado = ?, arduino_port = ? WHERE id = ?';
        await db.query(updateQuery, [nombre, direccion_bits, pilon_encargado, arduino_port, arduinoId]);

        const updatePilonesQuery = 'UPDATE pilones SET asignado = ? WHERE id = ?';
        await db.query(updatePilonesQuery, [arduinoId, pilon_encargado]);

        res.sendStatus(200); // Envía una respuesta exitosa al cliente
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Arduino', details: error.message });
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
        res.status(500).json({ error: 'Error deleting Arduino', details: error.message });
    }    
});

module.exports = router;