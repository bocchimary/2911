const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected');
  }
});

app.use(express.json());

app.post('/insert_data', (req, res) => {
  const { water_level } = req.body;

  const sql = 'INSERT INTO water_level_data (water_level) VALUES (?)';

  db.query(sql, [water_level], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ message: 'Error inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
