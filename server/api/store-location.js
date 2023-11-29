const express = require('express');
const router = express.Router();
const db = require('../path-to-db'); // Adjust the path

// Create a route to save location data
router.post('/store-location', (req, res) => {
  const { location } = req.body;

  // Insert data into the database
  const insertQuery = 'INSERT INTO locations (location) VALUES (?)';

  db.query(insertQuery, [location], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).send('Error saving location data');
      return;
    }

    // Data was successfully inserted into the database
    res.status(200).send('Location data saved successfully');
  });
});

module.exports = router;
