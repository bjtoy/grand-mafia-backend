const express = require("express");
const router = express.Router();

const {
  requireRole,
  requirePermission,
} = require("../middleware/auth-middleware");

const settingsController = require("../controllers/settingsController");

// ===============================
// SETTINGS (Admin Only)
// ===============================

// GET all settings
router.get(
  "/",
  requireRole("Admin"),
  requirePermission("MANAGE_SETTINGS"),
  settingsController.getAll
);

// UPDATE a setting
router.put(
  "/:id",
  requireRole("Admin"),
  requirePermission("MANAGE_SETTINGS"),
  settingsController.update
);

// CREATE a setting
router.post(
  "/",
  requireRole("Admin"),
  requirePermission("MANAGE_SETTINGS"),
  settingsController.create
);

// DELETE a setting
router.delete(
  "/:id",
  requireRole("Admin"),
  requirePermission("MANAGE_SETTINGS"),
  settingsController.remove
);

module.exports = router;
