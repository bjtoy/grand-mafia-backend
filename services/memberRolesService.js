const prisma = require("../config/db");

module.exports = {
  // Get all member-role links
  async getAll() {
    return await prisma.memberRole.findMany({
      include: {
        role: true
      },
      orderBy: { memberId: "asc" }
    });
  },

  // Get all roles for a specific member
  async getRolesForMember(memberId) {
    return await prisma.memberRole.findMany({
      where: { memberId },
      include: {
        role: true
      }
    });
  },

  // Get all members with a specific role
  async getMembersForRole(roleId) {
    return await prisma.memberRole.findMany({
      where: { roleId },
      include: {
        member: true
      }
    });
  }
};
