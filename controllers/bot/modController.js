const modService = require("../../services/bot/modService");

module.exports = {
  async getOverview(req, res) {
    try {
      const data = await modService.getOverview();
      res.json({ success: true, data });
    } catch (err) {
      console.error("Bot Mod Overview Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async getActiveCases(req, res) {
    try {
      const cases = await modService.getActiveCases();
      res.json({ success: true, cases });
    } catch (err) {
      console.error("Bot Active Cases Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async getWarnings(req, res) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    try {
      const warnings = await modService.getWarnings(userId);
      res.json({ success: true, warnings });
    } catch (err) {
      console.error("Bot Get Warnings Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async warnUser(req, res) {
    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({
        success: false,
        message: "userId and reason are required",
      });
    }

    try {
      const result = await modService.warnUser(userId, reason);
      res.json({ success: true, result });
    } catch (err) {
      console.error("Bot Warn Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async kickUser(req, res) {
    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({
        success: false,
        message: "userId and reason are required",
      });
    }

    try {
      const result = await modService.kickUser(userId, reason);
      res.json({ success: true, result });
    } catch (err) {
      console.error("Bot Kick Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },

  async banUser(req, res) {
    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({
        success: false,
        message: "userId and reason are required",
      });
    }

    try {
      const result = await modService.banUser(userId, reason);
      res.json({ success: true, result });
    } catch (err) {
      console.error("Bot Ban Error:", err);
      res.status(500).json({ success: false, error: "Bot service error" });
    }
  },
};
