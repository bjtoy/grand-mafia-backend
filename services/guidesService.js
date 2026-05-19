const pool = require("../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM guides ORDER BY updatedAt DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(`SELECT * FROM guides WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async create(title, content, category) {
    const [result] = await pool.query(
      `
      INSERT INTO guides (title, content, category)
      VALUES (?, ?, ?)
    `,
      [title, content, category || null]
    );
    return result.insertId;
  },

  async update(id, title, content, category) {
    const [result] = await pool.query(
      `
      UPDATE guides
      SET title = ?, content = ?, category = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [title, content, category || null, id]
    );

    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.query(`DELETE FROM guides WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },

  async publish(id) {
    const [result] = await pool.query(
      `
      UPDATE guides
      SET published = 1, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [id]
    );

    return result.affectedRows > 0;
  },
};
