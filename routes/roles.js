const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all roles
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM roles ORDER BY createdAt DESC');
        res.json({ success: true, roles: rows });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET role by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.json({ success: true, role: rows[0] });
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
