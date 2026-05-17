const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all guide versions
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guide_versions ORDER BY createdAt DESC'
        );
        res.json({ success: true, versions: rows });
    } catch (error) {
        console.error('Error fetching guide versions:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET all versions for a specific guide
router.get('/guide/:guideId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guide_versions WHERE guideId = ? ORDER BY createdAt DESC',
            [req.params.guideId]
        );

        res.json({ success: true, versions: rows });
    } catch (error) {
        console.error('Error fetching guide versions by guideId:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET a single version by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM guide_versions WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Guide version not found' });
        }

        res.json({ success: true, version: rows[0] });
    } catch (error) {
        console.error('Error fetching guide version:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
