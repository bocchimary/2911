const express = require('express');
const mysql = require('mysql2');
const app = express();



const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
};
app.use(cors());
const pool = mysql.createPool(dbConfig);

app.get('/status', async (req, res) => {
  try {
    const [rows, fields] = await pool.promise().query('SELECT * FROM status');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = 3003; // You can specify the port you want to use
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
