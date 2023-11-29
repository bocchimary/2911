const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mariel',
    database: 'db_alert',
});

db.connect(err => {
    if (err) {
      console.error('Database connection error: ' + err.message);
      return;
    }
    console.log('Connected to the database');
  });
  
  app.post('/water-level', (req, res) => {
    const { level } = req.body;
    const query = 'INSERT INTO water_level_data (level) VALUES (?)';
    db.query(query, [level], (err) => {
      if (err) {
        console.error('Error inserting data: ' + err.message);
        res.status(500).send('Error inserting data');
        return;
      }
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted');
    });
  });

  app.get('/data', (req, res) => {
    db.query('SELECT * FROM water_level_data', (err, results) => {
      if (err) {
        console.error('Error fetching data: ' + err.message);
        res.status(500).send('Error fetching data');
      } else {
        res.render('data.ejs', { data: results });
      }
    });
  });
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });