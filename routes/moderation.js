const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission,
} = require("../middleware/auth-middleware");

const moderationController = require("../controllers/moderationController");

// ===============================
// MODERATION ROUTES (Admin + Moderator)
// ===============================

// WARN MEMBER
router.post(
  "/warn",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("WARN_MEMBERS"),
  moderationController.warn
);

// DELETE MESSAGE (log only)
router.post(
  "/delete-message",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("DELETE_MESSAGES"),
  moderationController.deleteMessage
);

// PROMOTE MEMBER
router.post(
  "/promote",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("PROMOTE_MEMBERS"),
  moderationController.promote
);

// DEMOTE MEMBER
router.post(
  "/demote",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("DEMOTE_MEMBERS"),
  moderationController.demote
);

// GET MODERATION LOGS
router.get(
  "/logs",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("VIEW_AUDIT_LOG"),
  moderationController.getLogs
);

module.exports = router;
