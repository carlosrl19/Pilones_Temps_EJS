// routes.js
const express = require('express');
const router = express.Router();
const arduinosAPI = require('./_arduinos_api');
const pilonesAPI = require('./_pilones_api');
const temperaturesAPI = require('./_temperatures_api');
const humiditiesAPI = require('./_humidities_api');

// GET routes
router.get('/', (req, res) => {
    res.render('home/home', { currentUrl: req.originalUrl });
});
router.get('/individual_arduino', (req, res) => {
    res.render('home/individual_home', { currentUrl: req.originalUrl });
});
router.get('/pilones_list', async (req, res) => {
    res.render('lists/pilones_list', { currentUrl: req.originalUrl });
});
router.get('/arduino_list', async (req, res) => {
    res.render('lists/arduino_list', { currentUrl: req.originalUrl });
});
router.get('/temp_history', (req, res) => {
    res.render('history/temp_history', { currentUrl: req.originalUrl });
});
router.get('/graphics_history', (req, res) => {
    res.render('graphics/graphics_history', { currentUrl: req.originalUrl });
});
router.get('/hum_history', (req, res) => {
    res.render('history/humidity_history', { currentUrl: req.originalUrl });
});
router.get('/FAQ', (req, res) => {
    res.render('faqs/faqs', { currentUrl: req.originalUrl });
});

// API routes
router.use('/api/arduinos', arduinosAPI);
router.use('/api/pilones', pilonesAPI);
router.use('/api/temperatures', temperaturesAPI);
router.use('/api/humidities', humiditiesAPI);

// POST routes
router.post('/api/arduinos/arduino_list', arduinosAPI);
router.post('/api/temperatures/save_temp', temperaturesAPI);
router.post('/api/humidities/save_hum', humiditiesAPI);

module.exports = router;
