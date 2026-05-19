const pool = require("../config/db");

module.exports = {
  async getAll() {
    const [rows] = await pool.query(
      `
      SELECT id, username, email, createdAt, updatedAt
      FROM users
      ORDER BY id DESC
    `
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT id, username, email, createdAt, updatedAt
      FROM users
      WHERE id = ?
    `,
      [id]
    );

    return rows[0] || null;
  },

  async create(username, email, passwordHash) {
    const [result] = await pool.query(
      `
      INSERT INTO users (username, email, passwordHash)
      VALUES (?, ?, ?)
    `,
      [username, email, passwordHash]
    );

    return result.insertId;
  },

  async update(id, username, email, passwordHash) {
    const [result] = await pool.query(
      `
      UPDATE users
      SET username = ?, email = ?, passwordHash = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [username, email, passwordHash, id]
    );

    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  },
};

