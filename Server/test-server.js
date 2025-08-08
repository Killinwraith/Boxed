const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Single test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

console.log('About to start server...');

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

console.log('Server setup complete.');