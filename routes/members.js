const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission
} = require("../middleware/auth-middleware");

const membersController = require("../controllers/membersController");

// ============================================
// PUBLIC / READ-ONLY ROUTES
// ============================================

// GET ALL MEMBERS
router.get("/", membersController.getAll);

// GET MEMBER BY ID
router.get("/:id", membersController.getById);

// ============================================
// PROTECTED ROUTES (DISABLED - SECTION D)
// ============================================

router.post(
  "/",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_MEMBERS"),
  membersController.disabled
);

router.put(
  "/:id",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_MEMBERS"),
  membersController.disabled
);

router.delete(
  "/:id",
  requireAnyRole(["Admin", "Mod"]),
  requirePermission("MANAGE_MEMBERS"),
  membersController.disabled
);

module.exports = router;
