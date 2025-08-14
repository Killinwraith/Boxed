const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));


// Basic middleware
app.use(cors());
app.use(express.json());


// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.get('/api/testPrint', (req,res) => {

    const {message,messageTwo} = req.query
    res.json({
        message: message,
        messageTwo: messageTwo,
        status: 'success',
        timestamp: new Date().toISOString()
    });

});


// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});