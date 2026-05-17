const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json({ success: true, users: rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: rows[0] });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
