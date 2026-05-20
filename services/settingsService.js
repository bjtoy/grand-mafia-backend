const prisma = require("../config/db");

module.exports = {
  // ============================================
  // GET ALL SETTINGS
  // ============================================
  async getAll() {
    return await prisma.setting.findMany({
      orderBy: { id: "asc" }
    });
  },

  // ============================================
  // UPDATE SETTING
  // ============================================
  async update(id, value) {
    const updated = await prisma.setting.updateMany({
      where: { id },
      data: {
        value,
        updatedAt: new Date()
      }
    });

    return updated.count > 0;
  },

  // ============================================
  // CREATE SETTING
  // ============================================
  async create(key, value) {
    const setting = await prisma.setting.create({
      data: {
        keyName: key,
        value
      }
    });

    return setting.id;
  },

  // ============================================
  // DELETE SETTING
  // ============================================
  async remove(id) {
    const deleted = await prisma.setting.deleteMany({
      where: { id }
    });

    return deleted.count > 0;
  }
};
