const { syncMemberRoles } = require("../../services/roleSync");
const prisma = require("../../prisma/client");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    try {
      const discordRoles = newMember.roles.cache.map(r => r.id);

      await syncMemberRoles(
        prisma,
        newMember.id,
        discordRoles
      );

      console.log(`Synced roles for ${newMember.user.username}`);
    } catch (err) {
      console.error("Role sync error:", err);
    }
  }
};
