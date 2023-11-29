const express = require("express");
const app = express();
const bcrypt = require('bcrypt');

const plainPassword = 'password1'; // Replace with the actual password
const saltRounds = 10; // Number of salt rounds for bcrypt

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    // Store the 'hash' value in the database as the password for the admin account
    console.log('Hashed Password:', hash);
  }
});