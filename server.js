const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { SerialPort } = require('serialport');

const port = 3001;
const path = require('path');
const routes = require('./public/routes/routes');
const db = require('./public/config/database');

// Folder paths configurations
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

// Create a SerialPort instance with the path to your Arduino and baud rate
const arduinoPort = new SerialPort({ path:'/dev/ttyACM0', baudRate: 9600 });

let incompleteData = ''; // Variable para almacenar los datos incompletos recibidos del puerto serie

// Listen for data from Arduino and emit it through Socket.io
arduinoPort.on('data', (data) => {
  const receivedData = data.toString();
  const completeData = incompleteData + receivedData;
  const lines = completeData.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine !== '') {
      io.emit('temperature', trimmedLine); // Emitir el evento 'temperature' a todos los clientes conectados
    }
  }

  incompleteData = lines[lines.length - 1];
});

// Start the server
http.listen(port, () => {
  console.log(`\nServer in http://localhost:${port}\n`);
});