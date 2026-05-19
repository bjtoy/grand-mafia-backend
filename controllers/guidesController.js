const guidesService = require("../services/guidesService");

module.exports = {
  async getAll(req, res) {
    try {
      const guides = await guidesService.getAll();
      res.json({ success: true, data: guides });
    } catch (err) {
      console.error("Error fetching guides:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async getById(req, res) {
    try {
      const guide = await guidesService.getById(req.params.id);

      if (!guide) {
        return res
          .status(404)
          .json({ success: false, message: "Guide not found" });
      }

      res.json({ success: true, data: guide });
    } catch (err) {
      console.error("Error fetching guide:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async create(req, res) {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "title and content are required" });
    }

    try {
      const id = await guidesService.create(title, content, category);
      res.json({ success: true, id });
    } catch (err) {
      console.error("Error creating guide:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async update(req, res) {
    const { title, content, category } = req.body;

    try {
      const updated = await guidesService.update(
        req.params.id,
        title,
        content,
        category
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Guide not found" });
      }

      res.json({ success: true, message: "Guide updated" });
    } catch (err) {
      console.error("Error updating guide:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await guidesService.remove(req.params.id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Guide not found" });
      }

      res.json({ success: true, message: "Guide deleted" });
    } catch (err) {
      console.error("Error deleting guide:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async publish(req, res) {
    try {
      const published = await guidesService.publish(req.params.id);

      if (!published) {
        return res
          .status(404)
          .json({ success: false, message: "Guide not found" });
      }

      res.json({ success: true, message: "Guide published" });
    } catch (err) {
      console.error("Error publishing guide:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },
};
