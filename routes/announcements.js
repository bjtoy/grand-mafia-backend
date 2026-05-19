const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission,
} = require("../middleware/auth-middleware");

const announcementsController = require("../controllers/announcementsController");

// ===============================
// PUBLIC ROUTES
// ===============================

// GET all announcements
router.get("/", announcementsController.getAll);

// GET announcement by ID
router.get("/:id", announcementsController.getById);

// ===============================
// PROTECTED ROUTES (Admin + Moderator)
// ===============================

router.post(
  "/",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("CREATE_ANNOUNCEMENT"),
  announcementsController.create
);

router.put(
  "/:id",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("EDIT_ANNOUNCEMENT"),
  announcementsController.update
);

router.delete(
  "/:id",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("DELETE_ANNOUNCEMENT"),
  announcementsController.remove
);

router.post(
  "/:id/post",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("POST_ANNOUNCEMENT"),
  announcementsController.markPosted
);

module.exports = router;
