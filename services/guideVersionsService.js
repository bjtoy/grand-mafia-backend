const pool = require("../config/db");

module.exports = {
  async getAllForGuide(guideId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM guide_versions
      WHERE guideId = ?
      ORDER BY createdAt DESC
    `,
      [guideId]
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM guide_versions WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(guideId, title, content) {
    const [result] = await pool.query(
      `
      INSERT INTO guide_versions (guideId, title, content)
      VALUES (?, ?, ?)
    `,
      [guideId, title, content]
    );
    return result.insertId;
  },

  async update(id, title, content) {
    const [result] = await pool.query(
      `
      UPDATE guide_versions
      SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [title, content, id]
    );

    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM guide_versions WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
