// ============================================
// ROLE SYNC ENGINE (SECTION D)
// Prisma-powered rewrite
// Maps Discord roles → Internal roles
// Syncs member + member_roles tables
// ============================================

const prisma = require('./config/db');
const INTERNAL_ROLES = require('./config/roles');

// ============================================
// DISCORD → INTERNAL ROLE MAP
// ============================================

const DISCORD_ROLE_MAP = {
    Admin: process.env.ADMIN_ROLE_ID,
    Mod: process.env.MODERATOR_ROLE_ID,
    Enforcer: process.env.ENFORCER_ROLE_ID,
    Scout: process.env.SCOUT_ROLE_ID,
    Member: process.env.MEMBER_ROLE_ID
};

// ============================================
// 1. Convert Discord role IDs → Internal roles
// ============================================

function mapDiscordRolesToInternal(discordRoleIds = []) {
    const internalRoles = [];

    for (const [internalName, discordId] of Object.entries(DISCORD_ROLE_MAP)) {
        if (discordRoleIds.includes(discordId)) {
            internalRoles.push(internalName);
        }
    }

    // Always guarantee Member at minimum
    if (!internalRoles.includes('Member')) {
        internalRoles.push('Member');
    }

    return internalRoles;
}

// ============================================
// 2. Ensure internal roles exist in DB
// ============================================

async function ensureRolesExist() {
    const internalRoleNames = Object.keys(INTERNAL_ROLES);

    for (const roleName of internalRoleNames) {
        const existing = await prisma.role.findUnique({
            where: { name: roleName }
        });

        if (!existing) {
            await prisma.role.create({
                data: { name: roleName }
            });

            console.log(`✔ Created missing role in DB: ${roleName}`);
        }
    }
}

// ============================================
// 3. Sync a single member’s roles
// ============================================

async function syncMemberRoles(discordId, discordRoleIds = []) {
    try {
        // Ensure roles table is correct
        await ensureRolesExist();

        // Map Discord → Internal
        const internalRoles = mapDiscordRolesToInternal(discordRoleIds);

        // Ensure member exists
        let member = await prisma.member.findUnique({
            where: { discordId }
        });

        if (!member) {
            member = await prisma.member.create({
                data: {
                    discordId,
                    name: 'Unknown'
                }
            });
        }

        // Clear old roles
        await prisma.memberRole.deleteMany({
            where: { memberId: member.id }
        });

        // Insert new roles
        for (const roleName of internalRoles) {
            const role = await prisma.role.findUnique({
                where: { name: roleName }
            });

            if (role) {
                await prisma.memberRole.create({
                    data: {
                        memberId: member.id,
                        roleId: role.id
                    }
                });
            }
        }

        console.log(`✔ Synced roles for member ${discordId}: ${internalRoles.join(', ')}`);
        return internalRoles;

    } catch (error) {
        console.error('❌ Error syncing member roles:', error);
        return [];
    }
}

// ============================================
// 4. Sync ALL members (used on bot startup)
// ============================================

async function syncAllMembers(discordMembers) {
    for (const member of discordMembers.values()) {
        const discordId = member.id;
        const discordRoleIds = member.roles.cache.map(r => r.id);

        await syncMemberRoles(discordId, discordRoleIds);
    }

    console.log('✔ Completed full member role sync');
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    syncMemberRoles,
    syncAllMembers,
    mapDiscordRolesToInternal,
    ensureRolesExist
};
