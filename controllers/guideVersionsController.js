const guideVersionsService = require("../services/guideVersionsService");

module.exports = {
  async getAllForGuide(req, res) {
    try {
      const versions = await guideVersionsService.getAllForGuide(
        req.params.guideId
      );
      res.json({ success: true, data: versions });
    } catch (err) {
      console.error("Error fetching guide versions:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async getById(req, res) {
    try {
      const version = await guideVersionsService.getById(req.params.id);

      if (!version) {
        return res
          .status(404)
          .json({ success: false, message: "Guide version not found" });
      }

      res.json({ success: true, data: version });
    } catch (err) {
      console.error("Error fetching guide version:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async create(req, res) {
    const { guideId, title, content } = req.body;

    if (!guideId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "guideId, title, and content are required",
      });
    }

    try {
      const id = await guideVersionsService.create(guideId, title, content);
      res.json({ success: true, id });
    } catch (err) {
      console.error("Error creating guide version:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async update(req, res) {
    const { title, content } = req.body;

    try {
      const updated = await guideVersionsService.update(
        req.params.id,
        title,
        content
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Guide version not found" });
      }

      res.json({ success: true, message: "Guide version updated" });
    } catch (err) {
      console.error("Error updating guide version:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await guideVersionsService.remove(req.params.id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Guide version not found" });
      }

      res.json({ success: true, message: "Guide version deleted" });
    } catch (err) {
      console.error("Error deleting guide version:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },
};
