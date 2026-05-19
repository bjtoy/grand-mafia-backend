const logsService = require("../../services/bot/logsService");

module.exports = {
  async getRecentLogs(req, res) {
    try {
      const logs = await logsService.getRecentLogs();
      res.json({ success: true, logs });
    } catch (err) {
      console.error("Bot Recent Logs Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async getCaseLogs(req, res) {
    try {
      const cases = await logsService.getCaseLogs();
      res.json({ success: true, cases });
    } catch (err) {
      console.error("Bot Case Logs Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },
};
