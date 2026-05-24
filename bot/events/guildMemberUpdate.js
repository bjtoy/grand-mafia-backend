// ============================================
// guildMemberUpdate — Sync Discord Roles to Database
// ============================================

const { syncMemberRoles } = require('../../services/roleSync.js');
const prisma = require('../prisma/client');

module.exports = {
    name: 'guildMemberUpdate',

    async execute(oldMember, newMember) {
        try {
            // Ignore if roles didn't change
            if (
                oldMember.roles.cache.size === newMember.roles.cache.size &&
                oldMember.roles.cache.every(r => newMember.roles.cache.has(r.id))
            ) {
                return;
            }

            const discordRoles = newMember.roles.cache.map(r => r.id);

            await syncMemberRoles(
                prisma,
                newMember.id,
                discordRoles
            );

            console.log(`🔄 Synced roles for ${newMember.user.username}`);

        } catch (err) {
            console.error('❌ Role sync error:', err);
        }
    }
};
