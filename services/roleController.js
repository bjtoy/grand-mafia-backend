const rolesService = require("../services/rolesService");
const INTERNAL_ROLES = require("../config/roles");

module.exports = {
  async getAll(req, res) {
    try {
      const roles = await rolesService.getAll();

      res.json({
        success: true,
        roles,
        internalRoles: INTERNAL_ROLES
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  async getById(req, res) {
    try {
      const role = await rolesService.getById(req.params.id);

      if (!role) {
        return res.status(404).json({
          success: false,
          message: "Role not found"
        });
      }

      const internalDefinition = INTERNAL_ROLES[role.name] || null;

      res.json({
        success: true,
        role,
        internalDefinition
      });
    } catch (error) {
      console.error("Error fetching role:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },

  disabled(req, res) {
    return res.status(403).json({
      success: false,
      message:
        "Roles cannot be modified manually. Edit config/roles.js instead."
    });
  }
};
