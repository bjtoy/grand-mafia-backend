const prisma = require("../config/db");

module.exports = {
  async getAll() {
    return await prisma.member.findMany({
      orderBy: { createdAt: "desc" }
    });
  },

  async getById(id) {
    return await prisma.member.findUnique({
      where: { id }
    });
  }
};
