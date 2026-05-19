const settingsService = require("../services/settingsService");

module.exports = {
  async getAll(req, res) {
    try {
      const settings = await settingsService.getAll();
      res.json({ success: true, settings });
    } catch (err) {
      console.error("Error fetching settings:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async update(req, res) {
    const { value } = req.body;

    if (value === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "value is required" });
    }

    try {
      const updated = await settingsService.update(req.params.id, value);

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Setting not found" });
      }

      res.json({ success: true, message: "Setting updated" });
    } catch (err) {
      console.error("Error updating setting:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async create(req, res) {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "key and value are required",
      });
    }

    try {
      const id = await settingsService.create(key, value);
      res.json({ success: true, id });
    } catch (err) {
      console.error("Error creating setting:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await settingsService.remove(req.params.id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Setting not found" });
      }

      res.json({ success: true, message: "Setting deleted" });
    } catch (err) {
      console.error("Error deleting setting:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },
};
