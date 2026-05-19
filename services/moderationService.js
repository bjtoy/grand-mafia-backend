const pool = require("../config/db");

// Internal role hierarchy
const ROLE_ORDER = ["Member", "Scout", "Enforcer", "Moderator", "Admin"];

module.exports = {
  async warn(memberId, reason) {
    await pool.query(
      `
      INSERT INTO moderation_logs (memberId, action, reason)
      VALUES (?, 'WARN', ?)
    `,
      [memberId, reason]
    );
  },

  async deleteMessage(messageId, channelId, reason) {
    await pool.query(
      `
      INSERT INTO moderation_logs (action, messageId, channelId, reason)
      VALUES ('DELETE_MESSAGE', ?, ?, ?)
    `,
      [messageId, channelId, reason || null]
    );
  },

  async promote(memberId) {
    const [rows] = await pool.query(
      `
      SELECT r.name AS roleName, r.id AS roleId
      FROM member_roles mr
      JOIN roles r ON r.id = mr.roleId
      WHERE mr.memberId = ?
    `,
      [memberId]
    );

    if (rows.length === 0) {
      return { success: false, message: "Member has no role assigned" };
    }

    const currentRole = rows[0].roleName;
    const currentIndex = ROLE_ORDER.indexOf(currentRole);

    if (currentIndex === ROLE_ORDER.length - 1) {
      return { success: false, message: "Member is already at highest rank" };
    }

    const newRole = ROLE_ORDER[currentIndex + 1];

    // Update DB
    await pool.query(
      `
      UPDATE member_roles
      SET roleId = (SELECT id FROM roles WHERE name = ?)
      WHERE memberId = ?
    `,
      [newRole, memberId]
    );

    return { success: true, message: `Promoted to ${newRole}` };
  },

  async demote(memberId) {
    const [rows] = await pool.query(
      `
      SELECT r.name AS roleName, r.id AS roleId
      FROM member_roles mr
      JOIN roles r ON r.id = mr.roleId
      WHERE mr.memberId = ?
    `,
      [memberId]
    );

    if (rows.length === 0) {
      return { success: false, message: "Member has no role assigned" };
    }

    const currentRole = rows[0].roleName;
    const currentIndex = ROLE_ORDER.indexOf(currentRole);

    if (currentIndex === 0) {
      return { success: false, message: "Member is already at lowest rank" };
    }

    const newRole = ROLE_ORDER[currentIndex - 1];

    // Update DB
    await pool.query(
      `
      UPDATE member_roles
      SET roleId = (SELECT id FROM roles WHERE name = ?)
      WHERE memberId = ?
    `,
      [newRole, memberId]
    );

    return { success: true, message: `Demoted to ${newRole}` };
  },

  async getLogs() {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM moderation_logs
      ORDER BY createdAt DESC
    `
    );
    return rows;
  },
};
