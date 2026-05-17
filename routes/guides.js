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

// CREATE a new guide
router.post('/', async (req, res) => {
    const { title, content, category, style, author } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO guides 
            (title, content, category, style, author, views, likes, publishedAt) 
            VALUES (?, ?, ?, ?, ?, 0, 0, NULL)`,
            [title, content, category || null, style || null, author || null]
        );

        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating guide:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// UPDATE a guide
router.put('/:id', async (req, res) => {
    const { title, content, category, style, author, publishedAt } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE guides 
             SET title = ?, content = ?, category = ?, style = ?, author = ?, publishedAt = ?, updatedAt = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [
                title,
                content,
                category || null,
                style || null,
                author || null,
                publishedAt || null,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }

        res.json({ success: true, message: 'Guide updated' });
    } catch (error) {
        console.error('Error updating guide:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// DELETE a guide
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM guides WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }

        res.json({ success: true, message: 'Guide deleted' });
    } catch (error) {
        console.error('Error deleting guide:', error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});


module.exports = router;
