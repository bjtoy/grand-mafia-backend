const announcementsService = require("../services/announcementsService");

module.exports = {
  // GET /announcements
  async getAll(req, res) {
    try {
      const announcements = await announcementsService.getAll();
      res.json({ success: true, data: announcements });
    } catch (err) {
      console.error("Error fetching announcements:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  // GET /announcements/:id
  async getById(req, res) {
    try {
      const announcement = await announcementsService.getById(req.params.id);

      if (!announcement) {
        return res
          .status(404)
          .json({ success: false, message: "Announcement not found" });
      }

      res.json({ success: true, data: announcement });
    } catch (err) {
      console.error("Error fetching announcement:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  // POST /announcements
  async create(req, res) {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "title and content are required" });
    }

    try {
      const id = await announcementsService.create(title, content);
      res.json({ success: true, id });
    } catch (err) {
      console.error("Error creating announcement:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  // PUT /announcements/:id
  async update(req, res) {
    const { title, content } = req.body;

    try {
      const updated = await announcementsService.update(
        req.params.id,
        title,
        content
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Announcement not found" });
      }

      res.json({ success: true, message: "Announcement updated" });
    } catch (err) {
      console.error("Error updating announcement:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  // DELETE /announcements/:id
  async remove(req, res) {
    try {
      const deleted = await announcementsService.remove(req.params.id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Announcement not found" });
      }

      res.json({ success: true, message: "Announcement deleted" });
    } catch (err) {
      console.error("Error deleting announcement:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },

  // POST /announcements/:id/post
  async markPosted(req, res) {
    try {
      const posted = await announcementsService.markPosted(req.params.id);

      if (!posted) {
        return res
          .status(404)
          .json({ success: false, message: "Announcement not found" });
      }

      // 🔥 Section G Hook (future)
      // botService.sendAnnouncement(posted);

      res.json({ success: true, message: "Announcement posted" });
    } catch (err) {
      console.error("Error posting announcement:", err);
      res.status(500).json({ success: false, error: "Database error" });
    }
  },
};
