const prisma = require("../config/db");

module.exports = {
  // ============================================
  // GET ALL ANNOUNCEMENTS
  // ============================================
  async getAll() {
    return await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" }
    });
  },

  // ============================================
  // GET ANNOUNCEMENT BY ID
  // ============================================
  async getById(id) {
    return await prisma.announcement.findUnique({
      where: { id }
    });
  },

  // ============================================
  // CREATE ANNOUNCEMENT
  // ============================================
  async create(title, content) {
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content
      }
    });

    return announcement.id;
  },

  // ============================================
  // UPDATE ANNOUNCEMENT
  // ============================================
  async update(id, title, content) {
    const updated = await prisma.announcement.updateMany({
      where: { id },
      data: {
        title,
        content,
        updatedAt: new Date()
      }
    });

    return updated.count > 0;
  },

  // ============================================
  // DELETE ANNOUNCEMENT
  // ============================================
  async remove(id) {
    const deleted = await prisma.announcement.deleteMany({
      where: { id }
    });

    return deleted.count > 0;
  },

  // ============================================
  // MARK AS POSTED
  // ============================================
  async markPosted(id) {
    const updated = await prisma.announcement.updateMany({
      where: { id },
      data: {
        posted: true,
        updatedAt: new Date()
      }
    });

    return updated.count > 0;
  }
};
