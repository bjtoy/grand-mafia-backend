const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all announcements
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM announcements ORDER BY createdAt DESC');
        res.json({ success: true, announcements: rows });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET announcement by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.json({ success: true, announcement: rows[0] });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
