/**
 * Bot Logs Service
 * -----------------
 * This service handles backend → bot communication for log retrieval.
 * 
 * These functions currently return placeholder data.
 * Later, you will connect these to:
 * - Bot REST API
 * - Bot WebSocket
 * - Redis pub/sub
 * - Direct bot function calls
 */

module.exports = {
  async getRecentLogs() {
    // Placeholder structure — replace with real bot logs
    return [
      {
        id: 1,
        action: "WARN",
        userId: "0",
        moderatorId: "0",
        reason: "Placeholder log",
        timestamp: new Date().toISOString(),
      },
    ];
  },

  async getCaseLogs() {
    // Placeholder structure — replace with real case logs
    return [
      {
        caseId: 1,
        userId: "0",
        moderatorId: "0",
        actions: [],
        openedAt: new Date().toISOString(),
        closedAt: null,
      },
    ];
  },
};
