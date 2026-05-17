const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all guides
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM guides ORDER BY createdAt DESC');
        res.json({ success: true, guides: rows });
    } catch (error) {
        console.error('Error fetching guides:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET guide by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM guides WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }

        res.json({ success: true, guide: rows[0] });
    } catch (error) {
        console.error('Error fetching guide:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
