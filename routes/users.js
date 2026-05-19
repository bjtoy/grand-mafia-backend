const express = require("express");
const router = express.Router();

const {
  requireRole,
  requirePermission,
} = require("../middleware/auth-middleware");

const usersController = require("../controllers/usersController");

// ===============================
// USERS (Admin Only)
// ===============================

// GET all users
router.get(
  "/",
  requireRole("Admin"),
  requirePermission("MANAGE_USERS"),
  usersController.getAll
);

// GET user by ID
router.get(
  "/:id",
  requireRole("Admin"),
  requirePermission("MANAGE_USERS"),
  usersController.getById
);

// CREATE user
router.post(
  "/",
  requireRole("Admin"),
  requirePermission("MANAGE_USERS"),
  usersController.create
);

// UPDATE user
router.put(
  "/:id",
  requireRole("Admin"),
  requirePermission("MANAGE_USERS"),
  usersController.update
);

// DELETE user
router.delete(
  "/:id",
  requireRole("Admin"),
  requirePermission("MANAGE_USERS"),
  usersController.remove
);

module.exports = router;
