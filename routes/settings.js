const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all settings
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM server_settings');
        res.json({ success: true, settings: rows });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET setting by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM server_settings WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Setting not found' });
        }

        res.json({ success: true, setting: rows[0] });
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
