const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission
} = require("../middleware/auth-middleware");

const memberRolesController = require("../controllers/memberRolesController");

// ============================================
// READ-ONLY MEMBER ROLE API (SECTION D)
// Roles are synced automatically by the
// Role Sync Engine. Manual edits disabled.
// ============================================

// GET all member-role links
router.get("/", memberRolesController.getAll);

// GET all roles for a specific member
router.get("/member/:memberId", memberRolesController.getRolesForMember);

// GET all members with a specific role
router.get("/role/:roleId", memberRolesController.getMembersForRole);

// ============================================
// PROTECTED ROUTES (DISABLED)
// ============================================

router.post(
  "/",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_ROLES"),
  memberRolesController.disabled
);

router.delete(
  "/",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_ROLES"),
  memberRolesController.disabled
);

module.exports = router;
