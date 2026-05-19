const express = require("express");
const router = express.Router();

const {
  requireRole,
  requirePermission,
} = require("../../middleware/auth-middleware");

const adminController = require("../../controllers/bot/adminController");

// ===============================
// ADMIN BOT API (Admin Only)
// ===============================

// BOT STATUS
router.get(
  "/status",
  requireRole("Admin"),
  requirePermission("BOT_ADMIN_ACCESS"),
  adminController.getStatus
);

// GUILD INFO
router.get(
  "/guild-info",
  requireRole("Admin"),
  requirePermission("BOT_ADMIN_ACCESS"),
  adminController.getGuildInfo
);

// RELOAD BOT CONFIG
router.post(
  "/reload-config",
  requireRole("Admin"),
  requirePermission("BOT_ADMIN_ACTIONS"),
  adminController.reloadConfig
);

// SYNC ROLES (Bot ↔ Database)
router.post(
  "/sync-roles",
  requireRole("Admin"),
  requirePermission("BOT_ADMIN_ACTIONS"),
  adminController.syncRoles
);

module.exports = router;
