const moderationService = require("../services/moderationService");

module.exports = {
  async warn(req, res) {
    const { memberId, reason } = req.body;

    if (!memberId || !reason) {
      return res.status(400).json({
        success: false,
        message: "memberId and reason are required",
      });
    }

    try {
      await moderationService.warn(memberId, reason);
      res.json({ success: true, message: "Member warned" });
    } catch (err) {
      console.error("Warn error:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async deleteMessage(req, res) {
    const { messageId, channelId, reason } = req.body;

    if (!messageId || !channelId) {
      return res.status(400).json({
        success: false,
        message: "messageId and channelId are required",
      });
    }

    try {
      await moderationService.deleteMessage(messageId, channelId, reason);
      res.json({ success: true, message: "Message deletion logged" });
    } catch (err) {
      console.error("Delete message error:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async promote(req, res) {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "memberId is required",
      });
    }

    try {
      const result = await moderationService.promote(memberId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (err) {
      console.error("Promote error:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async demote(req, res) {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "memberId is required",
      });
    }

    try {
      const result = await moderationService.demote(memberId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (err) {
      console.error("Demote error:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async getLogs(req, res) {
    try {
      const logs = await moderationService.getLogs();
      res.json({ success: true, logs });
    } catch (err) {
      console.error("Get logs error:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },
};
