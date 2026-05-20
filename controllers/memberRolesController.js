const memberRolesService = require("../services/memberRolesService");

module.exports = {
  async getAll(req, res) {
    try {
      const links = await memberRolesService.getAll();
      res.json({ success: true, member_roles: links });
    } catch (error) {
      console.error("Error fetching member_roles:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  async getRolesForMember(req, res) {
    try {
      const roles = await memberRolesService.getRolesForMember(
        req.params.memberId
      );
      res.json({ success: true, roles });
    } catch (error) {
      console.error("Error fetching roles for member:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  async getMembersForRole(req, res) {
    try {
      const members = await memberRolesService.getMembersForRole(
        req.params.roleId
      );
      res.json({ success: true, members });
    } catch (error) {
      console.error("Error fetching members for role:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  // Disabled actions (Section D)
  disabled(req, res) {
    return res.status(403).json({
      success: false,
      message:
        "Member roles cannot be modified manually. Roles are synced automatically from Discord."
    });
  }
};
