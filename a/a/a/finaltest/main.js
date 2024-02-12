require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Establish MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use((req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include Authorization header
  next();
});

// Handle MySQL connection errors
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    // If there's an error connecting to MySQL, send a 500 Internal Server Error response
    res.status(500).json({ message: 'Internal Server Error', error: 'Error connecting to MySQL' });
    return;
  }

  console.log('Connected to MySQL');
});

app.use(bodyParser.json());

// JWT Secret key
const jwtSecret = 'your_secret_key';

// Middleware for authentication
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  console.log("Token from request:", token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.sendStatus(403);
    }

    console.log('Token verified successfully. User:', user);
    req.user = user;
    next();
  });
}

// Endpoint to create a table
app.post('/createtable', authenticateToken, (req, res) => {
  const createTableQuery = req.body.data;

  connection.query(createTableQuery, (err, results, fields) => {
    if (err) {
      console.error('Error creating table:', err);
      // If there's an error creating the table, send a 500 Internal Server Error response
      res.status(500).json({ message: 'Internal Server Error', error: err.sqlMessage });
    } else {
      console.log('Table created successfully. Fields:', fields);
      res.json({ message: 'Table created' });
    }
  });
});

app.post('/getData', authenticateToken, (req, res) => {
  const fetchDataQuery = req.body.data;

  connection.query(fetchDataQuery, (err, results, fields) => {
    if (err) {
      console.error('Error fetching data from table:', err);
      // If there's an error fetching data, send a 500 Internal Server Error response
      res.status(500).json({ message: 'Internal Server Error', error: err.sqlMessage });
    } else {
      console.log('Data fetched successfully');
      res.json({ data: results, fields, message: err });
    }
  });
});

// Endpoint for user login
app.post('/login', (req, res) => {
  // Replace this with your actual user authentication logic
  const { username, password } = req.body;
  if (username === 'exampleUser' && password === 'examplePassword') {
    // Generate a token
    const token = jwt.sign({ username }, jwtSecret);  // No expiresIn option

    console.log('User logged in successfully. Token:', token);
    res.json({ token });
  } else {
    console.log('Invalid credentials for login');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Close MySQL connection when the server is shutting down
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection:', err);
    } else {
      console.log('MySQL connection closed');
    }
    process.exit();
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
