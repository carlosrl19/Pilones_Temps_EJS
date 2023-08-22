// routes.js
const express = require('express');
const router = express.Router();
const arduinosAPI = require('./arduinos_api'); 

router.get('/', (req, res) => {
    res.render('home/home');
});

router.get('/individual_arduino', (req, res) => {
    res.render('home/individual_home');
});

router.get('/pilones_list', (req, res) => {
    res.render('lists/pilones_list');
});

router.get('/arduino_list', async (req, res) => {
    res.render('lists/arduino_list');
});

router.get('/temp_history', (req, res) => {
    res.render('history/temp_history');
});

router.get('/graphics_history', (req, res) => {
    res.render('graphics/graphics_history');
});

router.get('/hum_history', (req, res) => {
    res.render('history/humidity_history');
});

// API'S
router.use('/api/arduinos', arduinosAPI);

module.exports = router;
