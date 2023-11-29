const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Create a connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_alert',
  connectionLimit: 20, // Adjust this based on your requirements
});

app.use(cors());
app.use(bodyParser.json());


app.post('/register', (req, res) => {
  const { ip_address, location } = req.body;

  // Check for duplicate IP address
  pool.query('SELECT * FROM users WHERE ip_address = ?', [ip_address], (selectErr, selectResults) => {
      if (selectErr) {
          console.error('Error checking for duplicate IP:', selectErr);
          res.status(500).send('Error checking for duplicate IP.');
      } else {
          if (selectResults.length > 0) {
              res.status(409).send('IP address already exists');
          } else {
              // No duplicate found, proceed with the insertion
              pool.query('INSERT INTO users (ip_address, location) VALUES (?, ?)', [ip_address, location], (insertErr, insertResults) => {
                  if (insertErr) {
                      console.error('Error inserting data:', insertErr);
                      res.status(500).send('Error inserting data into the database.');
                  } else {
                      console.log('User has been registered successfully!');
                      res.status(200).send('User has been registered successfully!');
                  }
              });
          }
      }
  });
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { location, ip_address } = req.body;

  pool.query('UPDATE users SET location = ?, ip_address = ? WHERE id = ?', [location, ip_address, userId], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user.');
    } else {
      console.log('User updated successfully!');
      res.status(200).send('User updated successfully!');
    }
  });
});
 
// CHECK IF DUPLICATE IP
app.post('/checkDuplicate', (req, res) => {
  const { ip_address } = req.body;

  pool.query('SELECT 1 FROM users WHERE ip_address = ?', [ip_address], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error checking for duplicate data:', selectErr);
      res.status(500).json({ error: 'Error checking for duplicate data.' });
    } else {
      if (selectResults.length > 0) {
        // Duplicate IP address found
        const dupe = ip_address;
        console.log('Duplicate IP address:', dupe);
        res.status(200).json({ duplicate: true });
      } else {
        // No duplicate found
        res.status(200).json({ duplicate: false });
      }
    }

  });
});

let previousTotalConsumed = null;

// FOR REGISTER
app.post('/storeTotalConsumed', (req, res) => {
  const { totalConsumed } = req.body;

  // Check if the value has changed before storing
  if (totalConsumed !== previousTotalConsumed) {
    // Check if a record with ID 1 exists
    pool.query('SELECT * FROM logs_consumed WHERE id = ?', [1], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error checking for existing record:', selectErr);
        res.status(500).json({ error: 'Error checking for existing record.' });
        return;
      }

      if (selectResults.length > 0) {
        // Update the existing record with ID 1
        pool.query('UPDATE logs_consumed SET total_value = ? WHERE id = ?', [totalConsumed, 1], (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating total consumed data:', updateErr);
            res.status(500).send('Error updating total consumed data');
            return;
          }

          console.log('Total consumed data updated:', totalConsumed);

          // Update the previous total consumed value
          previousTotalConsumed = totalConsumed;

          res.sendStatus(200);
        });
      } else {
        // Insert a new record with ID 1
        pool.query('INSERT INTO logs_consumed (id, total_value) VALUES (?, ?)', [1, totalConsumed], (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting total consumed data:', insertErr);
            res.status(500).send('Error inserting total consumed data');
            return;
          }

          console.log('Total consumed data stored:', totalConsumed);

          // Update the previous total consumed value
          previousTotalConsumed = totalConsumed;

          res.sendStatus(200);
        });
      }
    });
  } else {
    console.log('Total consumed data unchanged. Skipping storage.');
    res.sendStatus(200);
  }
});



app.post('/getTotalValue', (req, res) => {
  const { totalValue } = req.body;
  pool.query('SELECT * FROM logs_consumed WHERE total_value = ?', [totalValue], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error checking for existing record:', selectErr);
      res.status(500).json({ error: 'Error checking for existing record.' });
    } else {
      res.json(selectResults); // Assuming you want to send the results back to the client
    }
  });
});

app.post('/startingRefills', (req, res) => {
  const { startingRefills } = req.body;
  pool.query('SELECT * FROM logs_consumed WHERE starting_refills = ?', [startingRefills], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error checking for existing record:', selectErr);
      res.status(500).json({ error: 'Error checking for existing record.' });
    } else {
      res.json(selectResults); // Assuming you want to send the results back to the client
    }
  });
});



app.post('/Remain', async (req, res) => {
  try {
    const { remainingValue } = req.body;

    // Assuming you have a unique identifier for the record, use that in the WHERE clause
    const recordIdentifier = 'remaining_refills';

    // Use placeholders in the SQL query to prevent SQL injection
    const updateQuery = 'UPDATE logs_consumed SET remaining_refills = ? WHERE starting_refills = ? and total_value = ?';

    pool.query(updateQuery, [remainingValue, recordIdentifier], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error updating record:', updateErr);
        res.status(500).json({ error: 'Error updating record.' });
      } else {
        res.json(updateResults); // Send the updated record back to the client
      }
    });
  } catch (error) {
    console.error('Error updating data to MySQL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve all data from logs_consumed except id
app.get('/getAllLogsConsumed', (req, res) => {
  pool.query('SELECT date, startingrefills, total_value, remaining_refills FROM logs_consumed', (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error retrieving logs_consumed data:', selectErr);
      res.status(500).json({ error: 'Error retrieving logs_consumed data.' });
    } else {
      res.status(200).json(selectResults);
    }
  });
});

app.post('/AddContainer', (req, res) => {
  const { starting_integer } = req.body;
  const insertQuery = `INSERT INTO logs_consumed (starting_integer) VALUES (?)`;

  pool.query(insertQuery, [starting_integer], (err, result) => {
      if (err) {
          console.error('Error inserting data: ' + err.stack);
          res.status(500).send('Error inserting data');
          return;
      }

      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
  });
});
  
app.post('/addToMySQL', (req, res) => {
  const { textBoxValue } = req.body;

  // Use CURRENT_TIMESTAMP directly in the SQL query
  const sql = 'INSERT INTO logs_consumed (date, startingrefills) VALUES (NOW(), ?)';

  pool.query(sql, [textBoxValue], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
    } else {
      console.log('Data inserted into MySQL successfully');
      res.status(200).json({ message: 'Data inserted into MySQL successfully' });
    }
  });
});

// Endpoint to get the latest date from MySQL
app.get('/getDate', (req, res) => {
  // Assuming you have a way to retrieve the date from the database
  const sql = 'SELECT date FROM logs_consumed ORDER BY date DESC LIMIT 1';

  pool.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving date from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving date from MySQL' });
    } else {
      const date = result[0]?.date || null;
      res.status(200).json({ date });
    }
  });
});

/*
app.post('/addToMySQL', (req, res) => {
  const { textBoxValue, date } = req.body;
  

  const sql = 'INSERT INTO logs_consumed (date, startingrefills) VALUES (NOW(), ?)';
  
  pool.query(sql, [ timestampToUse, textBoxValue], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
    } else {
      console.log('Data inserted into MySQL successfully');
      res.status(200).json({ message: 'Data inserted into MySQL successfully' });
    }
  });
}); 

app.get('/getDate', (req, res) => {app.post('/addToMySQL', (req, res) => {
  const { textBoxValue} = req.body;

  const sql = 'INSERT INTO logs_consumed (date, startingrefills) VALUES (NOW(), ?)';


  pool.query(sql, [textBoxValue], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Error inserting data into MySQL' });
    } else {
      console.log('Data inserted into MySQL successfully');
      res.status(200).json({ message: 'Data inserted into MySQL successfully' });
    }
  });
});

app.get('/getDate', (req, res) => {
  // Assuming you have a way to retrieve the timestamp from the database
  const sql = 'SELECT date FROM logs_consumed ORDER BY date DESC LIMIT 1';

  pool.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving date from MySQL:', err);
      res.status(500).json({ error: 'Error retrieving date from MySQL' });
    } else {
      const date = result[0]?.date || null;
      res.status(200).json({ date });
    }
  });
});

  // Assuming you have a way to retrieve the timestamp from the database
});

*/
// FOR DELETE
// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
