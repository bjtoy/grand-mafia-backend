const adminService = require("../../services/bot/adminService");

module.exports = {
  async getStatus(req, res) {
    try {
      const status = await adminService.getStatus();
      res.json({ success: true, status });
    } catch (err) {
      console.error("Bot Admin Status Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async getGuildInfo(req, res) {
    try {
      const info = await adminService.getGuildInfo();
      res.json({ success: true, info });
    } catch (err) {
      console.error("Bot Guild Info Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async reloadConfig(req, res) {
    try {
      const result = await adminService.reloadConfig();
      res.json({ success: true, result });
    } catch (err) {
      console.error("Bot Reload Config Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async syncRoles(req, res) {
    try {
      const result = await adminService.syncRoles();
      res.json({ success: true, result });
    } catch (err) {
      console.error("Bot Sync Roles Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },
};
