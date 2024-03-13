const express = require('express');
const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5555;
const secretKey = 'mySecretKey'; // Change this to your own secret key

// Sample data
const dataArray = [
  { id: 1, name: 'Object 1', value: 'Value 1', description: 'Description 1', status: 'Active' },
  { id: 2, name: 'Object 2', value: 'Value 2', description: 'Description 2', status: 'Inactive' },
  { id: 3, name: 'Object 3', value: 'Value 3', description: 'Description 3', status: 'Active' },
  { id: 4, name: 'Object 4', value: 'Value 4', description: 'Description 4', status: 'Inactive' },
  { id: 5, name: 'Object 5', value: 'Value 5', description: 'Description 5', status: 'Active' }
];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // const token = req.headers['authorization'];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extracting token from 'Bearer <token>'
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.decoded = decoded;
    next();
  });
};

// Middleware to parse JSON request body
app.use(express.json());

app.get('/', () => {
  res.json("API is runnung successfully");
})

// Public route to generate JWT token
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Here you would typically check username and password against your database
  // For simplicity, let's just generate a token
  const token = jwt.sign({ username }, secretKey, { expiresIn: '3d' });
  res.json({ token });
});

// Protected route to get sample data
app.get('/api/data', verifyToken, (req, res) => {
  res.json(dataArray);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
