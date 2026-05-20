const prisma = require("../config/db");

const ROLE_ORDER = ["Member", "Scout", "Enforcer", "Moderator", "Admin"];

module.exports = {
  // ============================================
  // WARN
  // ============================================
  async warn(memberId, reason) {
    await prisma.moderationLog.create({
      data: {
        action: "WARN",
        reason,
        member: { connect: { id: memberId } }
      }
    });
  },

  // ============================================
  // DELETE MESSAGE
  // ============================================
  async deleteMessage(messageId, channelId, reason) {
    await prisma.moderationLog.create({
      data: {
        action: "DELETE_MESSAGE",
        reason: reason || null,
        targetUser: null,
        targetUserId: null,
        duration: null,
        memberId: null,
        messageId,
        channelId
      }
    });
  },

  // ============================================
  // PROMOTE
  // ============================================
  async promote(memberId) {
    const current = await prisma.memberRole.findFirst({
      where: { memberId },
      include: { role: true }
    });

    if (!current) {
      return { success: false, message: "Member has no role assigned" };
    }

    const currentIndex = ROLE_ORDER.indexOf(current.role.name);

    if (currentIndex === ROLE_ORDER.length - 1) {
      return { success: false, message: "Member is already at highest rank" };
    }

    const newRoleName = ROLE_ORDER[currentIndex + 1];

    const newRole = await prisma.role.findUnique({
      where: { name: newRoleName }
    });

    if (!newRole) {
      return { success: false, message: "Target role does not exist" };
    }

    await prisma.memberRole.update({
      where: { id: current.id },
      data: { roleId: newRole.id }
    });

    return { success: true, message: `Promoted to ${newRoleName}` };
  },

  // ============================================
  // DEMOTE
  // ============================================
  async demote(memberId) {
    const current = await prisma.memberRole.findFirst({
      where: { memberId },
      include: { role: true }
    });

    if (!current) {
      return { success: false, message: "Member has no role assigned" };
    }

    const currentIndex = ROLE_ORDER.indexOf(current.role.name);

    if (currentIndex === 0) {
      return { success: false, message: "Member is already at lowest rank" };
    }

    const newRoleName = ROLE_ORDER[currentIndex - 1];

    const newRole = await prisma.role.findUnique({
      where: { name: newRoleName }
    });

    if (!newRole) {
      return { success: false, message: "Target role does not exist" };
    }

    await prisma.memberRole.update({
      where: { id: current.id },
      data: { roleId: newRole.id }
    });

    return { success: true, message: `Demoted to ${newRoleName}` };
  },

  // ============================================
  // GET LOGS
  // ============================================
  async getLogs() {
    return await prisma.moderationLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        member: true
      }
    });
  }
};
