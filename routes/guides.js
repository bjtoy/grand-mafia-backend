const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission,
} = require("../middleware/auth-middleware");

const guidesController = require("../controllers/guidesController");

// ===============================
// PUBLIC ROUTES
// ===============================

// GET all guides
router.get("/", guidesController.getAll);

// GET guide by ID
router.get("/:id", guidesController.getById);

// ===============================
// PROTECTED ROUTES
// ===============================

// CREATE guide (Admin, Moderator, Enforcer)
router.post(
  "/",
  requireAnyRole(["Admin", "Moderator", "Enforcer"]),
  requirePermission("CREATE_GUIDE"),
  guidesController.create
);

// UPDATE guide (Admin, Moderator, Enforcer)
router.put(
  "/:id",
  requireAnyRole(["Admin", "Moderator", "Enforcer"]),
  requirePermission("EDIT_GUIDE"),
  guidesController.update
);

// DELETE guide (Admin, Moderator)
router.delete(
  "/:id",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("DELETE_GUIDE"),
  guidesController.remove
);

// PUBLISH guide (Admin, Moderator)
router.post(
  "/:id/publish",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("PUBLISH_GUIDE"),
  guidesController.publish
);

module.exports = router;
