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

// Add this line to parse JSON in request bodies
app.use(express.json());

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


/*
---------------------------------------------------

######################################
*   ARDUINO CONFIGURATION - SERVER   *
######################################

*/
const arduinoPort = new SerialPort({ path:'/dev/ttyACM0', baudRate: 9600 }); // Create a SerialPort instance with the path to your Arduino and baud rate

let incompleteData = ''; // Variable to store incomplete data received from serial port

// Listen for data from Arduino and emit it through Socket.io
arduinoPort.on('data', (data) => {
  const receivedData = data.toString();
  const completeData = incompleteData + receivedData;
  const lines = completeData.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine !== '') {
      io.emit('sensorData', trimmedLine); // Emit the 'sensorData' event to all connected clients
    }
  }

  incompleteData = lines[lines.length - 1];
});

/*---------------------------
P U E R T O S - C O N F I G S
-----------------------------*/

// Puerto dev/ttyACM0
arduinoPort.on('open', () => {
  console.log('Serial port in dev/ttyACM0 opened');
});

arduinoPort.on('error', (err) => {
  console.error('Serial port in dev/ttyACM0 error:', err.message);
});

// ---------------------------------------------------

// Start the server
http.listen(port, () => {
  console.log(`\nServer in http://localhost:${port}\n`);
});