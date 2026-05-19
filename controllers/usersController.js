const usersService = require("../services/usersService");

module.exports = {
  async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      res.json({ success: true, users });
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async getById(req, res) {
    try {
      const user = await usersService.getById(req.params.id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({ success: true, user });
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async create(req, res) {
    const { username, email, passwordHash } = req.body;

    if (!username || !email || !passwordHash) {
      return res.status(400).json({
        success: false,
        message: "username, email, and passwordHash are required",
      });
    }

    try {
      const id = await usersService.create(username, email, passwordHash);
      res.json({ success: true, id });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async update(req, res) {
    const { username, email, passwordHash } = req.body;

    try {
      const updated = await usersService.update(
        req.params.id,
        username,
        email,
        passwordHash
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "User updated" });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await usersService.remove(req.params.id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({ success: true, message: "User deleted" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },
};
