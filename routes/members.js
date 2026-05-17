const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ============================================
// GET ALL MEMBERS
// ============================================

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM members ORDER BY id DESC');
        res.json({ success: true, members: rows });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// GET MEMBER BY ID
// ============================================

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM members WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.json({ success: true, member: rows[0] });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// CREATE MEMBER
// ============================================

router.post('/', async (req, res) => {
    const { username, discordId } = req.body;

    if (!username || !discordId) {
        return res.status(400).json({
            success: false,
            message: 'username and discordId are required'
        });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO members (username, discordId) VALUES (?, ?)',
            [username, discordId]
        );

        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// UPDATE MEMBER
// ============================================

router.put('/:id', async (req, res) => {
    const { username, discordId } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE members 
             SET username = ?, discordId = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [username, discordId, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.json({ success: true, message: 'Member updated' });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ============================================
// DELETE MEMBER
// ============================================

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM members WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.json({ success: true, message: 'Member deleted' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;
