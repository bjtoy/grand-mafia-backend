const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission,
} = require("../../middleware/auth-middleware");

const logsController = require("../../controllers/bot/logsController");

// ===============================
// BOT LOGS API (Admin + Moderator)
// ===============================

// RECENT LOGS
router.get(
  "/recent",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_LOGS_VIEW"),
  logsController.getRecentLogs
);

// CASE LOGS
router.get(
  "/cases",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("BOT_LOGS_VIEW"),
  logsController.getCaseLogs
);

module.exports = router;
