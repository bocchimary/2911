const axios = require('axios');
const mysql = require('mysql2');
const express = require('express');
const http = require('http');

const esp8266ServerURL = 'http://192.168.18.28';
const esp8266ServerPort = 80;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error creating MySQL connection pool:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
  connection.release();
});

const app = express();
const server = http.createServer(app); // Create an HTTP server to use with SSE
const port = 3003;


// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// SSE endpoint
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  // Create a function to send data to the client
  const sendDataToClient = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Set up an interval to fetch and send data to the client
  setInterval(async () => {
    const data = await fetchDataFromESP8266AndStoreInDB();

    if (data) {
      sendDataToClient(data);
    }
  }, 5000);
});

let lastStoredData = null; // Variable to store the last stored data

async function fetchDataFromESP8266AndStoreInDB() {
  try {
    const response = await axios.get(`${esp8266ServerURL}:${esp8266ServerPort}/getwaterstatus`);
    const data = response.data;

    if (data.water_level === 'HIGH' || data.water_level === 'LOW') {
      console.log('Received data from ESP8266:', data.water_level);

      // Check if the received data is different from the last stored data
      if (data.water_level !== lastStoredData) {
        // Insert the new data into the new table (replace 'new_table' with your table name)
        const [newRows, newFields] = await pool.promise().execute('INSERT INTO new_table (water_level) VALUES (?)', [data.water_level]);
        console.log('Data inserted into the "new_table" table in MySQL');

        // Update the last stored data with the new data
        lastStoredData = data.water_level;
      }

      // Always insert data into the original 'status' table
      const [rows, fields] = await pool.promise().execute('INSERT INTO status (water_level) VALUES (?)', [data.water_level]);
      console.log('Data inserted into the "status" table in MySQL');

      return data;
    } else {
      console.log('Invalid water level data:', data.water_level);
      return null;
    }
  } catch (error) {
    console.error('Error with MySQL:', error);
    return null;
  }
}
