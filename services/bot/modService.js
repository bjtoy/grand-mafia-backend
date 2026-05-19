/**
 * Moderator Bot Service
 * ----------------------
 * This service handles communication between the backend and the bot.
 * For now, these functions return placeholder data structures.
 * 
 * Later, you will connect these to:
 * - Bot REST API
 * - Bot WebSocket
 * - Redis pub/sub
 * - Direct bot function calls
 */

module.exports = {
  async getOverview() {
    // Placeholder structure — replace with bot integration
    return {
      totalCases: 0,
      activeCases: 0,
      totalWarnings: 0,
      recentActions: [],
    };
  },

  async getActiveCases() {
    // Placeholder structure
    return [];
  },

  async getWarnings(userId) {
    // Placeholder structure
    return [];
  },

  async warnUser(userId, reason) {
    // Placeholder — send to bot later
    return {
      action: "WARN",
      userId,
      reason,
      status: "queued",
    };
  },

  async kickUser(userId, reason) {
    // Placeholder — send to bot later
    return {
      action: "KICK",
      userId,
      reason,
      status: "queued",
    };
  },

  async banUser(userId, reason) {
    // Placeholder — send to bot later
    return {
      action: "BAN",
      userId,
      reason,
      status: "queued",
    };
  },
};
