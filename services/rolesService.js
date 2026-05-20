const prisma = require("../config/db");

module.exports = {
  async getAll() {
    return await prisma.role.findMany({
      orderBy: { name: "asc" }
    });
  },

  async getById(id) {
    return await prisma.role.findUnique({
      where: { id }
    });
  }
};
