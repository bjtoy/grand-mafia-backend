const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all members
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM members ORDER BY createdAt DESC');
        res.json({ success: true, members: rows });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// GET member by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.json({ success: true, member: rows[0] });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
