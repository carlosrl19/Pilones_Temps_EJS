const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const routes = require('./public/routes/routes');  // Paths routes.js
const db = require('./public/config/database');

app.set('views', path.join(__dirname, 'public/views'));

app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.set('view engine', 'ejs');

// Database connection to views and controllers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Imported Routes 
app.use('/', routes);
app.use('/individual_arduino', routes);
app.use('/arduino_list', routes);
app.use('/pilones_list', routes);
app.use('/graphics_history', routes);
app.use('/temp_history', routes);
app.use('/hum_history', routes);

app.listen(port, () => {
  console.log(`\nServer in http://localhost:${port}\n`);
});