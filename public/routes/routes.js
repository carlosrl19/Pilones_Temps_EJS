// routes.js
const express = require('express');
const router = express.Router();
const arduinosAPI = require('./_arduinos_api');
const pilonesAPI = require('./_pilones_api');
const pilonesTaskAPI = require('./_pilones_task_api');
const workerAPI = require('./_worker_api');
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
router.get('/pilones_tasks', async (req, res) => {
    res.render('lists/pilones_tasks', { currentUrl: req.originalUrl });
});
router.get('/arduino_list', async (req, res) => {
    res.render('lists/arduino_list', { currentUrl: req.originalUrl });
});
router.get('/worker_list', async (req, res) => {
    res.render('lists/worker_list', { currentUrl: req.originalUrl });
});
router.get('/temp_history', (req, res) => {
    res.render('history/temp_history', { currentUrl: req.originalUrl });
});
router.get('/temperature_graphics_history', (req, res) => {
    res.render('graphics/temp_graphics', { currentUrl: req.originalUrl });
});
router.get('/humidity_graphics_history', (req, res) => {
    res.render('graphics/hum_graphics', { currentUrl: req.originalUrl });
});
router.get('/hum_history', (req, res) => {
    res.render('history/humidity_history', { currentUrl: req.originalUrl });
});
router.get('/FAQ', (req, res) => {
    res.render('faqs/faqs', { currentUrl: req.originalUrl });
});
router.get('/not_implement_yet', (req, res) => {
    res.render('faqs/not_implement_yet', { currentUrl: req.originalUrl });
});

// API routes
router.use('/api/arduinos', arduinosAPI);
router.use('/api/pilones', pilonesAPI);
router.use('/api/pilones_task', pilonesTaskAPI);
router.use('/api/workers', workerAPI);
router.use('/api/temperatures', temperaturesAPI);
router.use('/api/humidities', humiditiesAPI);

// POST routes
router.post('/api/arduinos/arduino_list', arduinosAPI);
router.post('/api/temperatures/save_temp', temperaturesAPI);
router.post('/api/humidities/save_hum', humiditiesAPI);

module.exports = router;
