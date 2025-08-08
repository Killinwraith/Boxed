// express: Imports the Express.js framework - the core of our web server
// cors: Cross-Origin Resource Sharing middleware - allows your React app (running on port 3000) to talk to your API (running on port 5000)
// dotenv: Loads environment variables from the .env file into process.env
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create an instance of our Express application
const app = express();
// sets the port from environment variable or defaults to 5000
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your React app URL
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));



// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running!' });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Example CRUD routes
app.get('/api/users', (req, res) => {
  // Mock data - replace with database queries
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  // Mock user creation
  const newUser = {
    id: Date.now(), // Simple ID generation
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  // Mock user update
  const updatedUser = {
    id: parseInt(id),
    name,
    email,
    updatedAt: new Date().toISOString()
  };
  
  res.json(updatedUser);
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted successfully` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});