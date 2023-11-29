const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql2'); // Use the callback-based 'mysql2' package
const cors = require('cors');

const app = express();

// Create a MySQL connection pool (replace with your database credentials)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mariel',
  database: 'db_alert',
});

// Express session middleware
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));

// cors
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the URL of your Next.js app
  credentials: true, // Enable credentials (cookies, sessions)
};

app.use(cors(corsOptions));

// Passport.js middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Retrieve user from MySQL by username
      pool.query('SELECT * FROM tbl_admin WHERE username = ?', [username], (err, results) => {
        if (err) {
          return done(err);
        }

        if (results.length === 0) {
          return done(null, false, { message: 'Incorrect username' });
        }

        const user = results[0];

        // Compare the entered password with the hashed password in the database
        bcrypt.compare(password, user.password, (bcryptErr, passwordMatch) => {
          if (bcryptErr) {
            return done(bcryptErr);
          }

          if (!passwordMatch) {
            return done(null, false, { message: 'Incorrect password' });
          }

          return done(null, user);
        });
      });
    } catch (error) {
      return done(error);
    }
  })
);

// Passport.js serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    pool.query('SELECT * FROM tbl_admin WHERE id = ?', [id], (err, results) => {
      if (err) {
        return done(err);
      }

      if (results.length === 0) {
        return done(new Error('User not found'));
      }

      const user = results[0];
      done(null, user);
    });
  } catch (error) {
    done(error);
  }
});

// Protected route
app.get('/dashboard/admin', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // User is authenticated, allow access to the protected page
    res.send('Welcome to the Admin Dashboard!');
  } else {
    // User is not authenticated, redirect to login
    res.redirect('/auth/admin');
  }
});

// Login route
app.get('/auth/admin', (req, res) => {
  res.send('Please log in');
});

// Passport.js login route
app.post(
  '/api/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard/admin', // Redirect to the protected page on successful login
    failureRedirect: '/auth/admin',    // Redirect back to the login page on failed login
  })
);

// Start the server
const port = 3001; // Choose a port that is not used by Next.js
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
