const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission,
} = require("../../middleware/auth-middleware");

const modController = require("../../controllers/bot/modController");

// ===============================
// MODERATOR BOT API (Admin + Moderator)
// ===============================

// GET moderation overview
router.get(
  "/overview",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_MOD_ACCESS"),
  modController.getOverview
);

// GET active cases
router.get(
  "/active-cases",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_MOD_ACCESS"),
  modController.getActiveCases
);

// GET warnings for a user
router.get(
  "/warnings/:userId",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_MOD_ACCESS"),
  modController.getWarnings
);

// WARN user
router.post(
  "/warn",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_MOD_ACTIONS"),
  modController.warnUser
);

// KICK user
router.post(
  "/kick",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_MOD_ACTIONS"),
  modController.kickUser
);

// BAN user
router.post(
  "/ban",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_MOD_ACTIONS"),
  modController.banUser
);

module.exports = router;
