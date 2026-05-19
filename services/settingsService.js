const pool = require("../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM settings ORDER BY id ASC`
    );
    return rows;
  },

  async update(id, value) {
    const [result] = await pool.query(
      `
      UPDATE settings
      SET value = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [value, id]
    );

    return result.affectedRows > 0;
  },

  async create(key, value) {
    const [result] = await pool.query(
      `
      INSERT INTO settings (keyName, value)
      VALUES (?, ?)
    `,
      [key, value]
    );

    return result.insertId;
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM settings WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  },
};
