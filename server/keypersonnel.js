// Add a secret key
const secretKey = 'key';

// ...

// Middleware to parse JSON requests
app.use(express.json());

// API endpoints

// Verify the secret key to access the dashboard
app.post('/api/dashboard', (req, res) => {
  const { key } = req.body;

  if (key === secretKey) {
    // The key is correct; allow access to the dashboard
    res.json({ message: 'Access granted to the dashboard' });
  } else {
    // The key is incorrect; deny access
    res.status(401).json({ error: 'Access denied' });
  }
});

// ...
