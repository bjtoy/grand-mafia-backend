const pool = require("../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM announcements ORDER BY createdAt DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM announcements WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(title, content) {
    const [result] = await pool.query(
      `INSERT INTO announcements (title, content) VALUES (?, ?)`,
      [title, content]
    );
    return result.insertId;
  },

  async update(id, title, content) {
    const [result] = await pool.query(
      `
      UPDATE announcements
      SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [title, content, id]
    );

    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM announcements WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  async markPosted(id) {
    const [result] = await pool.query(
      `
      UPDATE announcements
      SET posted = 1, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [id]
    );

    return result.affectedRows > 0;
  },
};
