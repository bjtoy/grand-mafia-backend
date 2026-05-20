const membersService = require("../services/membersService");

module.exports = {
  async getAll(req, res) {
    try {
      const members = await membersService.getAll();
      res.json({ success: true, members });
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  async getById(req, res) {
    try {
      const member = await membersService.getById(req.params.id);

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found"
        });
      }

      res.json({ success: true, member });
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  disabled(req, res) {
    return res.status(403).json({
      success: false,
      message:
        "Members cannot be manually modified. They are synced automatically."
    });
  }
};
