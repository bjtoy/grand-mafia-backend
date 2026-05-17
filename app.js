const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // your MySQL connection

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Routes
app.use('/api/users', require('./routes/users'));  // ⭐ Added users route

// Test route
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT "Backend is connected!" AS message');
        res.json({ success: true, message: rows[0].message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = app;
