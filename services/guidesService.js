const prisma = require("../config/db");

module.exports = {
  // ============================================
  // GET ALL GUIDES
  // ============================================
  async getAll() {
    return await prisma.guide.findMany({
      orderBy: { updatedAt: "desc" }
    });
  },

  // ============================================
  // GET GUIDE BY ID
  // ============================================
  async getById(id) {
    return await prisma.guide.findUnique({
      where: { id }
    });
  },

  // ============================================
  // CREATE GUIDE
  // ============================================
  async create(title, content, category) {
    const guide = await prisma.guide.create({
      data: {
        title,
        content,
        category: category || null
      }
    });

    return guide.id;
  },

  // ============================================
  // UPDATE GUIDE
  // ============================================
  async update(id, title, content, category) {
    const updated = await prisma.guide.updateMany({
      where: { id },
      data: {
        title,
        content,
        category: category || null,
        updatedAt: new Date()
      }
    });

    return updated.count > 0;
  },

  // ============================================
  // DELETE GUIDE
  // ============================================
  async remove(id) {
    const deleted = await prisma.guide.deleteMany({
      where: { id }
    });

    return deleted.count > 0;
  },

  // ============================================
  // PUBLISH GUIDE
  // ============================================
  async publish(id) {
    const updated = await prisma.guide.updateMany({
      where: { id },
      data: {
        published: true,
        updatedAt: new Date()
      }
    });

    return updated.count > 0;
  }
};
