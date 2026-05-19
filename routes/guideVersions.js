const express = require("express");
const router = express.Router();

const {
  requireAnyRole,
  requirePermission,
} = require("../middleware/auth-middleware");

const guideVersionsController = require("../controllers/guideVersionsController");

// ===============================
// PUBLIC ROUTES
// ===============================

// GET all versions for a guide
router.get("/guide/:guideId", guideVersionsController.getAllForGuide);

// GET specific version
router.get("/:id", guideVersionsController.getById);

// ===============================
// PROTECTED ROUTES
// ===============================

// CREATE version (Admin, Moderator, Enforcer)
router.post(
  "/",
  requireAnyRole(["Admin", "Moderator", "Enforcer"]),
  requirePermission("MANAGE_GUIDE_VERSIONS"),
  guideVersionsController.create
);

// UPDATE version (Admin, Moderator, Enforcer)
router.put(
  "/:id",
  requireAnyRole(["Admin", "Moderator", "Enforcer"]),
  requirePermission("EDIT_GUIDE_VERSION"),
  guideVersionsController.update
);

// DELETE version (Admin, Moderator)
router.delete(
  "/:id",
  requireAnyRole(["Admin", "Moderator"]),
  requirePermission("DELETE_GUIDE_VERSION"),
  guideVersionsController.remove
);

module.exports = router;
