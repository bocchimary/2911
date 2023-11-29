const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3002;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_alert',
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// CRUD Application

// READ (select)
app.get("/stuffs", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({ message: "No data found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.get("/inventory", (req, res) => {
  connection.query("SELECT * FROM inventory", (err, results) => {
    try {
      if (results.length > 0) {
        const dataWithTimestamp = results.map((item) => ({
          ...item,
          timestamp: new Date().toLocaleString(),
        }));
        res.json(dataWithTimestamp);
      } else {
        res.json({ message: "No data found." });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
