const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission
} = require("../middleware/auth-middleware");

const rolesController = require("../controllers/rolesController");

// ============================================
// READ-ONLY ROLE API (SECTION D)
// ============================================

// GET all roles
router.get("/", rolesController.getAll);

// GET role by ID
router.get("/:id", rolesController.getById);

// ============================================
// PROTECTED ROUTES (DISABLED)
// ============================================

router.post(
  "/",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_ROLES"),
  rolesController.disabled
);

router.delete(
  "/:id",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_ROLES"),
  rolesController.disabled
);

module.exports = router;
