const prisma = require("../config/db");

module.exports = {
  // ============================================
  // GET ALL VERSIONS FOR A GUIDE
  // ============================================
  async getAllForGuide(guideId) {
    return await prisma.guideVersion.findMany({
      where: { guideId },
      orderBy: { createdAt: "desc" }
    });
  },

  // ============================================
  // GET VERSION BY ID
  // ============================================
  async getById(id) {
    return await prisma.guideVersion.findUnique({
      where: { id }
    });
  },

  // ============================================
  // CREATE VERSION
  // ============================================
  async create(guideId, title, content) {
    const version = await prisma.guideVersion.create({
      data: {
        guideId,
        title,
        content
      }
    });

    return version.id;
  },

  // ============================================
  // UPDATE VERSION
  // ============================================
  async update(id, title, content) {
    const updated = await prisma.guideVersion.updateMany({
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
  // DELETE VERSION
  // ============================================
  async remove(id) {
    const deleted = await prisma.guideVersion.deleteMany({
      where: { id }
    });

    return deleted.count > 0;
  }
};
